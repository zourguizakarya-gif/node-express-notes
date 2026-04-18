CREATE DATABASE IF NOT EXISTS notes_db CHARACTER SET utf8mb4;
USE notes_db;

CREATE TABLE IF NOT EXISTS notes (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  title   VARCHAR(100) NOT NULL,
  content TEXT,
  color   VARCHAR(7) DEFAULT '#ffffff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes (title, content, color) VALUES
('مرحبا بك', 'هذا تطبيق ملاحظات بسيط', '#fef9c3'),
('قائمة التسوق', 'خبز، حليب، بيض', '#dcfce7'),
('أفكار', 'تعلّم Node.js وExpress', '#e0f2fe');
