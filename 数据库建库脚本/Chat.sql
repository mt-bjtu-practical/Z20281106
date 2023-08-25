-- DROP TABLE IF EXISTS group_chat_message;
-- DROP TABLE IF EXISTS group_chat_member;
-- DROP TABLE IF EXISTS group_chat_info;
-- DROP TABLE IF EXISTS group_chat;
-- DROP TABLE IF EXISTS private_chat_message;
-- DROP TABLE IF EXISTS private_chat_info;
-- DROP TABLE IF EXISTS private_chat;
-- DROP TABLE IF EXISTS contacts;
-- DROP TABLE IF EXISTS user;
DROP DATABASE IF EXISTS Chat;
CREATE DATABASE Chat;
USE Chat;


CREATE TABLE user(
    id VARCHAR(20)  primary key not null,
    password VARCHAR(8) not null,
    nickname VARCHAR(20),
    avatar BLOB,
    sex  CHAR(1), 
    friend_count SMALLINT UNSIGNED DEFAULT 0,
    CONSTRAINT c_id CHECK(id REGEXP '^[A-Za-z0-9]+$'),
    CONSTRAINT c_gender CHECK(sex IN ('f', 'm'))
);



CREATE TABLE private_chat(
    chat_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user1_id VARCHAR(20),
    user2_id VARCHAR(20),
    FOREIGN KEY (user1_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE contacts(
    user_id VARCHAR(20),
    friend_id VARCHAR(20),
    remark VARCHAR(20),
    chat_id INT UNSIGNED,
    CONSTRAINT c_contacts_pkey PRIMARY KEY(user_id, friend_id),
    CONSTRAINT c_contacts_fkey1 FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE, 
    CONSTRAINT c_contacts_fkey2 FOREIGN KEY (friend_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES private_chat(chat_id) ON DELETE CASCADE
);



CREATE TABLE private_chat_info(
    user_id VARCHAR(20),
    chat_with_id VARCHAR(20),
    chat_id INT UNSIGNED,
    do_not_disturb BOOLEAN,
    PRIMARY KEY(user_id, chat_with_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (chat_with_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES private_chat(chat_id) ON DELETE CASCADE
);


CREATE TABLE private_chat_message(
    message_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
    chat_id INT UNSIGNED,
    sender_id VARCHAR(20),
    receiver_id VARCHAR(20),
    send_time DATETIME,
    message_content VARCHAR(200),
    UNIQUE KEY(chat_id, message_id),
    CONSTRAINT c_pcm_fkey_chat_id FOREIGN KEY (chat_id) REFERENCES private_chat(chat_id) ON DELETE CASCADE,
    CONSTRAINT c_pcm_fkey_sender_id FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT c_pcm_fkey_receiver_id FOREIGN KEY (receiver_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_PCM ON private_chat_message (chat_id);


CREATE TABLE application_message(
    message_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
    sender_id VARCHAR(20),
    receiver_id VARCHAR(20),
    send_time DATETIME,
    message_content VARCHAR(200),
    application_state INT,
    CONSTRAINT c_am_fkey_sender_id FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT c_am_fkey_receiver_id FOREIGN KEY (receiver_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE group_chat(
    chat_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    chat_name VARCHAR(50),
    owner_id VARCHAR(20),
    member_count INT UNSIGNED,
    FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE group_chat ADD CONSTRAINT chk_member_count CHECK (member_count <= 500);


CREATE TABLE group_chat_info(
    user_id VARCHAR(20),
    chat_id INT UNSIGNED,
    remark VARCHAR(20),
    intragroup_nickname VARCHAR(20),
    PRIMARY KEY(user_id, chat_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES group_chat(chat_id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE group_chat_member(
    chat_id INT UNSIGNED,
    member_id VARCHAR(20),
    intragroup_nickname VARCHAR(20),
    PRIMARY KEY (chat_id, member_id),
    FOREIGN KEY (chat_id) REFERENCES group_chat(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE group_chat_message(
    message_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    chat_id INT UNSIGNED,
    sender_id VARCHAR(20),
    send_time DATETIME,
    
    message_content TEXT,
    UNIQUE KEY (chat_id, message_id),
    FOREIGN KEY (chat_id) REFERENCES group_chat(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);



DROP TRIGGER IF EXISTS create_contacts_private_chat_info;

delimiter //
CREATE TRIGGER create_contacts_private_chat_info
AFTER INSERT ON private_chat
FOR EACH ROW
BEGIN
    DECLARE user1_id VARCHAR(20);
    DECLARE user2_id VARCHAR(20);
    DECLARE chat_id INT UNSIGNED;
    SET user1_id = NEW.user1_id;
    SET user2_id = NEW.user2_id;
    SET chat_id = NEW.chat_id;
    
    INSERT INTO contacts (user_id, friend_id, remark, chat_id) VALUES (user1_id, user2_id, NULL, chat_id);
    INSERT INTO contacts (user_id, friend_id, remark, chat_id) VALUES (user2_id, user1_id, NULL, chat_id);
    INSERT INTO private_chat_info (user_id, chat_with_id, chat_id, do_not_disturb) VALUES ( user1_id, user2_id, chat_id, FALSE);
    INSERT INTO private_chat_info (user_id, chat_with_id, chat_id, do_not_disturb) VALUES ( user2_id, user1_id, chat_id, FALSE);
END;//
delimiter ;

DROP TRIGGER IF EXISTS create_group_chat;
delimiter //
CREATE TRIGGER create_group_chat
AFTER INSERT ON group_chat
FOR EACH ROW
BEGIN
    DECLARE owner_id VARCHAR(20);
    DECLARE chat_id INT UNSIGNED;
    SET owner_id = NEW.owner_id;
    SET chat_id = NEW.chat_id;
    
    INSERT INTO group_chat_info (user_id, chat_id, remark, intragroup_nickname) VALUES (owner_id, chat_id, NULL, NULL);
    INSERT INTO group_chat_member (chat_id, member_id, intragroup_nickname) VALUES (chat_id, owner_id, NULL);
END;//
delimiter ;

DROP TRIGGER IF EXISTS add_group_chat_member;

delimiter //
CREATE TRIGGER add_group_member
AFTER INSERT ON group_chat_member
FOR EACH ROW
BEGIN
    DECLARE member_id VARCHAR(20);
    DECLARE chat_id INT UNSIGNED;
    DECLARE intragroup_nickname VARCHAR(20);
    SET member_id = NEW.member_id;
    SET chat_id = NEW.chat_id;
    SET intragroup_nickname = NEW.intragroup_nickname;

    INSERT INTO group_chat_info (user_id, chat_id, remark, intragroup_nickname) VALUES (member_id, chat_id, NULL, intragroup_nickname);
END;//
delimiter ;

-- SET @sql = CONCAT('INSERT INTO contacts (user_id, friend_id, remark) VALUES (',
--                     user1_id, ', ', user2_id, ', NULL);',
--                     'INSERT INTO contacts (user_id, friend_id, remark) VALUES (',
--                     user2_id, ', ', user1_id, ', NULL);',
--                     'INSERT INTO private_chat_info (user_id, chat_with_id, chat_id, do_not_disturb) VALUES (',
--                     user1_id, ', ', user2_id, ', ', chat_id, ', FALSE);',
--                     'INSERT INTO private_chat_info (user_id, chat_with_id, chat_id, do_not_disturb) VALUES (',
--                     user2_id, ', ', user1_id, ', ', chat_id, ', FALSE);',
--                     );

CREATE VIEW view_pc_last_msg_info(chat_id, last_msg_id, last_msg_time, last_msg)
AS SELECT chat_id, message_id, send_time, message_content
FROM private_chat_message
WHERE (chat_id, message_id) IN (
    SELECT chat_id, MAX(message_id)
    FROM private_chat_message
    GROUP BY chat_id
);


CREATE VIEW view_pc_outline(user_id, chat_with_id, remark, chat_id, last_msg_time, last_msg)
AS SELECT private_chat_info.user_id, chat_with_id, remark, private_chat_info.chat_id, last_msg_time, last_msg
FROM private_chat_info, contacts, view_pc_last_msg_info
WHERE private_chat_info.chat_id = view_pc_last_msg_info.chat_id and 
private_chat_info.user_id = contacts.user_id and private_chat_info.chat_with_id = contacts.friend_id;

CREATE VIEW view_user_male 
AS SELECT id, nickname, avatar
FROM user
WHERE sex = 'm';

-- CREATE VIEW view_pmessage_remark
-- AS SELECT message_id, contacts.chat_id, sender_id, remark, receiver_id, date(send_time), message_content
-- FROM private_chat_message, contacts
-- WHERE private_chat_message.sender_id = contacts.user_id and private_chat_message.receiver_id = contacts.friend_id;

CREATE VIEW view_pmessage_remark
AS SELECT message_id, contacts.chat_id, sender_id, remark, receiver_id, date(send_time), message_content
FROM private_chat_message, contacts
WHERE private_chat_message.sender_id = contacts.user_id ;

CREATE VIEW view_pmessage_date(message_id, chat_id, sender_id, receiver_id, date_send_time, message_content)
AS SELECT message_id, chat_id, sender_id, receiver_id, date(send_time), message_content
FROM private_chat_message;

CREATE VIEW view_friends_user(user, friend_count)
AS SELECT user_id,  count(friend_id) 
FROM contacts
GROUP BY user_id;

CREATE VIEW view_user_sex_count(sex, count)
AS SELECT sex, count(sex)
FROM user
GROUP BY sex;

-- 存储过程
DROP PROCEDURE query_contacts;
delimiter //
CREATE PROCEDURE query_contacts(IN id VARCHAR(20))
BEGIN
    SELECT * FROM contacts WHERE user_id = id;
END//
delimiter ;

DROP PROCEDURE add_friend;
delimiter //
CREATE PROCEDURE add_friend(IN id1 VARCHAR(20), IN id2 VARCHAR(20))
BEGIN
    INSERT INTO private_chat(user1_id, user2_id) VALUES (id1, id2);
END//
delimiter ;

DROP PROCEDURE delete_user;
delimiter //
CREATE PROCEDURE delete_user(IN user_id VARCHAR(20))
BEGIN
    DELETE FROM user WHERE id = user_id;
END//
delimiter ;

DROP PROCEDURE modify_nickname;
delimiter //
CREATE PROCEDURE modify_nickname(IN user_id VARCHAR(20), IN new_nickname VARCHAR(20))
BEGIN
    UPDATE user SET nickname = new_nickname WHERE id = user_id;
END//
delimiter ;

DROP PROCEDURE myuser1_friend_add1;
delimiter //
CREATE PROCEDURE myuser1_friend_add1()
BEGIN
    START TRANSACTION;
    UPDATE user SET friend_count = friend_count + 1 WHERE id = "myuser1";
    
    -- 检查操作是否成功，如果有错误或需要回滚，执行回滚操作
    IF  THEN
        ROLLBACK;
        SELECT '操作失败，已回滚';
    ELSE
        COMMIT;
        SELECT '操作成功，已提交';
    END IF;
END//
delimiter ;


DROP PROCEDURE add1;
DELIMITER //
CREATE PROCEDURE add1()
BEGIN
    DECLARE friend_count SMALLINT UNSIGNED;
    -- 开始事务
    START TRANSACTION;
    UPDATE user SET friend_count = friend_count + 1 WHERE id = "myuser1";
    SELECT friend_count FROM user WHERE id = 'myuser1' INTO friend_count;

    -- 检查操作是否成功，如果有错误或需要回滚，执行回滚操作
    IF friend_count > 3 THEN
        ROLLBACK;
        SELECT '操作失败，已回滚';
    ELSE
        COMMIT;
        SELECT '操作成功，已提交';
    END IF;
END //

DELIMITER ;