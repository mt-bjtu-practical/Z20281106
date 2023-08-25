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