
use elearning;
create database elearning;

-- 1. Create User Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    telegram_link VARCHAR(255),
    specialization VARCHAR(100),
    gender VARCHAR(10),
    date_of_birth DATE,
    user_role VARCHAR(20) DEFAULT 'Student',
    last_login DATETIME,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
-- 2. Create Course Table
CREATE TABLE course (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sub_description TEXT,
    category_id int,
    video_id VARCHAR(255) unique,
    duration INT, -- in minutes
    status VARCHAR(20) DEFAULT 'Active',
    price int,
    user_id INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    foreign key (category_id) references category( category_id ) on delete set null
);

-- 3. Create Enrollment Table (Weak entity/Junction)
CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Enrolled', -- Enrolled, Completed, Cancelled
    last_watched DATETIME,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    cancelled_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
);

-- 4. Create Rating Table
CREATE TABLE rating (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollment(enrollment_id) ON DELETE CASCADE
);

-- 5. Create Activity Log Table
CREATE TABLE activity_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);


-- =====================================================
-- Seed Data: 100 records (users, category, course, enrollment)
-- Seed Data: 20 records (rating, activity_log)
-- =====================================================

-- ---------- USERS (100) ----------
-- Role distribution: 70% Student, 15% Teacher, 15% Admin
-- Specialization: NULL for Students; assigned for Teacher/Admin
INSERT INTO users (full_name, email, password, phone_number, telegram_link, specialization, gender, date_of_birth, user_role, last_login) VALUES
('Betty Reed', 'betty.reed1@example.com', '$2y$10$hashedpassword0001', '+85552235350', 'https://t.me/bettyreed1', NULL, 'Female', '1993-11-16', 'Student', '2025-07-28 05:12:06'),
('Dorothy Moore', 'dorothy.moore2@example.com', '$2y$10$hashedpassword0002', '+85543101783', 'https://t.me/dorothymoore2', NULL, 'Other', '1990-11-23', 'Student', '2025-05-27 21:14:44'),
('Stephanie Campbell', 'stephanie.campbell3@example.com', '$2y$10$hashedpassword0003', '+85539436733', 'https://t.me/stephaniecampbell3', 'Database Administration', 'Male', '1996-06-06', 'Admin', NULL),
('Michael Anderson', 'michael.anderson4@example.com', '$2y$10$hashedpassword0004', '+85530514014', 'https://t.me/michaelanderson4', NULL, 'Other', '1994-06-21', 'Student', '2025-02-27 13:53:39'),
('Scott Reyes', 'scott.reyes5@example.com', '$2y$10$hashedpassword0005', '+85581016525', 'https://t.me/scottreyes5', NULL, 'Other', '2004-04-22', 'Student', '2023-08-23 19:33:01'),
('Dennis Wright', 'dennis.wright6@example.com', '$2y$10$hashedpassword0006', '+85596028436', 'https://t.me/denniswright6', NULL, 'Female', '1994-10-02', 'Student', '2023-01-07 09:35:22'),
('Nicholas Ross', 'nicholas.ross7@example.com', '$2y$10$hashedpassword0007', '+85533978249', 'https://t.me/nicholasross7', NULL, 'Male', '2004-07-11', 'Student', '2025-11-05 22:10:18'),
('Margaret Martin', 'margaret.martin8@example.com', '$2y$10$hashedpassword0008', '+85560185867', 'https://t.me/margaretmartin8', 'Business Analysis', 'Other', '2002-06-19', 'Teacher', '2023-01-02 21:48:24'),
('Michelle Morales', 'michelle.morales9@example.com', '$2y$10$hashedpassword0009', '+85512614124', NULL, NULL, 'Female', '2004-09-16', 'Student', '2024-09-21 08:43:05'),
('Linda Walker', 'linda.walker10@example.com', '$2y$10$hashedpassword0010', '+85586149359', 'https://t.me/lindawalker10', 'Database Administration', 'Male', '2001-06-01', 'Teacher', '2025-12-26 04:34:43'),
('Thomas James', 'thomas.james11@example.com', '$2y$10$hashedpassword0011', '+85573791320', 'https://t.me/thomasjames11', 'Network Engineering', 'Male', '1990-12-12', 'Teacher', '2025-05-16 07:42:40'),
('Anna Long', 'anna.long12@example.com', '$2y$10$hashedpassword0012', '+85536998038', 'https://t.me/annalong12', NULL, 'Female', '2000-01-25', 'Student', '2025-06-16 18:50:39'),
('Laura Thomas', 'laura.thomas13@example.com', '$2y$10$hashedpassword0013', '+85543273328', 'https://t.me/laurathomas13', NULL, 'Female', '1985-06-22', 'Student', '2024-04-16 21:25:28'),
('Mark Smith', 'mark.smith14@example.com', '$2y$10$hashedpassword0014', '+85519528530', 'https://t.me/marksmith14', NULL, 'Male', '1990-02-19', 'Student', NULL),
('Robert Nelson', 'robert.nelson15@example.com', '$2y$10$hashedpassword0015', '+85519510312', 'https://t.me/robertnelson15', 'Database Administration', 'Female', '2000-01-03', 'Teacher', '2023-09-28 20:47:27'),
('Pamela Stewart', 'pamela.stewart16@example.com', '$2y$10$hashedpassword0016', '+85542614537', 'https://t.me/pamelastewart16', NULL, 'Female', '1989-04-09', 'Student', NULL),
('Gregory Parker', 'gregory.parker17@example.com', '$2y$10$hashedpassword0017', '+85557553014', 'https://t.me/gregoryparker17', NULL, 'Female', '2004-05-17', 'Student', '2023-07-21 02:12:24'),
('Stephanie Sanders', 'stephanie.sanders18@example.com', '$2y$10$hashedpassword0018', '+85555540424', 'https://t.me/stephaniesanders18', 'Cybersecurity', 'Male', '1990-07-30', 'Admin', '2025-07-07 05:06:13'),
('Jason White', 'jason.white19@example.com', '$2y$10$hashedpassword0019', '+85547385696', 'https://t.me/jasonwhite19', 'Software Testing', 'Male', '1994-12-10', 'Teacher', '2026-02-01 03:33:53'),
('Michael Wood', 'michael.wood20@example.com', '$2y$10$hashedpassword0020', '+85582556484', 'https://t.me/michaelwood20', NULL, 'Male', '2005-10-11', 'Student', '2024-04-29 06:03:18'),
('Timothy Morales', 'timothy.morales21@example.com', '$2y$10$hashedpassword0021', '+85574606833', 'https://t.me/timothymorales21', NULL, 'Female', '2005-03-29', 'Student', NULL),
('Edward Smith', 'edward.smith22@example.com', '$2y$10$hashedpassword0022', '+85562401521', 'https://t.me/edwardsmith22', NULL, 'Female', '1991-05-26', 'Student', '2026-02-12 17:43:08'),
('Karen Harris', 'karen.harris23@example.com', '$2y$10$hashedpassword0023', '+85549823450', 'https://t.me/karenharris23', NULL, 'Male', '1997-12-28', 'Student', '2023-05-05 11:25:04'),
('Linda Miller', 'linda.miller24@example.com', '$2y$10$hashedpassword0024', '+85588406989', 'https://t.me/lindamiller24', 'Web Development', 'Other', '1988-07-13', 'Admin', '2023-06-14 06:45:56'),
('William Kim', 'william.kim25@example.com', '$2y$10$hashedpassword0025', '+85519121552', 'https://t.me/williamkim25', 'Data Science', 'Male', '1994-01-21', 'Teacher', '2026-03-12 08:57:51'),
('Justin Kim', 'justin.kim26@example.com', '$2y$10$hashedpassword0026', '+85515334035', 'https://t.me/justinkim26', NULL, 'Female', '1999-09-30', 'Student', '2025-12-06 11:31:07'),
('Dorothy Clark', 'dorothy.clark27@example.com', '$2y$10$hashedpassword0027', '+85599889098', 'https://t.me/dorothyclark27', 'UI/UX Design', 'Male', '1990-12-16', 'Teacher', '2024-09-06 16:38:49'),
('Kenneth Long', 'kenneth.long28@example.com', '$2y$10$hashedpassword0028', '+85519736572', NULL, NULL, 'Other', '1997-08-18', 'Student', '2023-05-31 19:34:28'),
('Betty Cook', 'betty.cook29@example.com', '$2y$10$hashedpassword0029', '+85545594597', NULL, 'Data Science', 'Female', '2004-10-04', 'Admin', '2025-01-26 10:22:33'),
('Christopher Cruz', 'christopher.cruz30@example.com', '$2y$10$hashedpassword0030', '+85582909480', 'https://t.me/christophercruz30', NULL, 'Other', '2003-02-07', 'Student', '2023-01-17 20:11:32'),
('Joshua James', 'joshua.james31@example.com', '$2y$10$hashedpassword0031', '+85523903144', 'https://t.me/joshuajames31', NULL, 'Male', '1990-12-07', 'Student', '2023-08-08 20:08:32'),
('Karen Wright', 'karen.wright32@example.com', '$2y$10$hashedpassword0032', '+85547816686', 'https://t.me/karenwright32', NULL, 'Other', '1992-09-09', 'Student', '2024-06-24 18:24:04'),
('Gary Allen', 'gary.allen33@example.com', '$2y$10$hashedpassword0033', '+85516818112', NULL, NULL, 'Female', '2003-08-09', 'Student', '2023-01-08 12:08:39'),
('Jerry Taylor', 'jerry.taylor34@example.com', '$2y$10$hashedpassword0034', '+85595511909', 'https://t.me/jerrytaylor34', NULL, 'Male', '2001-08-17', 'Student', '2025-05-25 20:25:19'),
('Mary Anderson', 'mary.anderson35@example.com', '$2y$10$hashedpassword0035', '+85520099059', 'https://t.me/maryanderson35', 'Mobile Development', 'Other', '2005-04-10', 'Teacher', '2025-01-26 21:12:30'),
('Stephen Jackson', 'stephen.jackson36@example.com', '$2y$10$hashedpassword0036', '+85567684996', NULL, NULL, 'Female', '1993-03-07', 'Student', '2023-03-23 13:01:38'),
('Anthony Mendoza', 'anthony.mendoza37@example.com', '$2y$10$hashedpassword0037', '+85543491314', 'https://t.me/anthonymendoza37', 'Network Engineering', 'Female', '2002-07-01', 'Admin', '2025-04-12 22:35:51'),
('Catherine Martin', 'catherine.martin38@example.com', '$2y$10$hashedpassword0038', '+85541774346', 'https://t.me/catherinemartin38', NULL, 'Male', '2004-10-08', 'Student', '2024-01-03 12:05:40'),
('Timothy Bennett', 'timothy.bennett39@example.com', '$2y$10$hashedpassword0039', '+85543308443', 'https://t.me/timothybennett39', 'UI/UX Design', 'Other', '1987-06-05', 'Admin', '2025-08-21 08:05:54'),
('Margaret Collins', 'margaret.collins40@example.com', '$2y$10$hashedpassword0040', '+85556930359', 'https://t.me/margaretcollins40', NULL, 'Male', '1990-01-01', 'Student', NULL),
('Matthew Phillips', 'matthew.phillips41@example.com', '$2y$10$hashedpassword0041', '+85554058573', 'https://t.me/matthewphillips41', NULL, 'Male', '2002-05-07', 'Student', '2025-11-09 14:33:06'),
('Frank Morgan', 'frank.morgan42@example.com', '$2y$10$hashedpassword0042', '+85554446182', 'https://t.me/frankmorgan42', NULL, 'Male', '2004-09-02', 'Student', '2024-01-01 21:08:19'),
('Dorothy Jones', 'dorothy.jones43@example.com', '$2y$10$hashedpassword0043', '+85524549543', 'https://t.me/dorothyjones43', NULL, 'Female', '2001-05-05', 'Student', '2025-06-12 22:04:17'),
('Angela Anderson', 'angela.anderson44@example.com', '$2y$10$hashedpassword0044', '+85561700055', 'https://t.me/angelaanderson44', NULL, 'Male', '1990-09-18', 'Student', NULL),
('Sharon Smith', 'sharon.smith45@example.com', '$2y$10$hashedpassword0045', '+85579782527', 'https://t.me/sharonsmith45', NULL, 'Other', '2000-05-28', 'Student', '2024-02-08 13:15:39'),
('Sharon Rodriguez', 'sharon.rodriguez46@example.com', '$2y$10$hashedpassword0046', '+85599152472', 'https://t.me/sharonrodriguez46', NULL, 'Other', '1992-01-16', 'Student', '2023-09-13 10:56:03'),
('Nicholas Flores', 'nicholas.flores47@example.com', '$2y$10$hashedpassword0047', '+85599508850', 'https://t.me/nicholasflores47', NULL, 'Female', '2000-08-21', 'Student', '2023-09-18 06:59:04'),
('Rebecca Bennett', 'rebecca.bennett48@example.com', '$2y$10$hashedpassword0048', '+85560888017', 'https://t.me/rebeccabennett48', NULL, 'Male', '1998-10-22', 'Student', '2025-04-11 19:56:59'),
('James Hill', 'james.hill49@example.com', '$2y$10$hashedpassword0049', '+85548508907', 'https://t.me/jameshill49', NULL, 'Other', '1998-08-10', 'Student', '2025-08-10 16:05:05'),
('Jeffrey Gray', 'jeffrey.gray50@example.com', '$2y$10$hashedpassword0050', '+85538682516', 'https://t.me/jeffreygray50', NULL, 'Other', '1988-10-22', 'Student', '2024-08-04 18:46:01'),
('Gregory Brooks', 'gregory.brooks51@example.com', '$2y$10$hashedpassword0051', '+85593115778', 'https://t.me/gregorybrooks51', 'Cloud Computing', 'Male', '2000-02-03', 'Admin', '2024-02-12 05:21:53'),
('Patricia Garcia', 'patricia.garcia52@example.com', '$2y$10$hashedpassword0052', '+85542862209', 'https://t.me/patriciagarcia52', NULL, 'Other', '2004-01-23', 'Student', '2025-07-21 15:05:21'),
('Benjamin Kelly', 'benjamin.kelly53@example.com', '$2y$10$hashedpassword0053', '+85536096655', 'https://t.me/benjaminkelly53', NULL, 'Female', '1996-02-02', 'Student', '2023-10-30 23:53:10'),
('Alexander Smith', 'alexander.smith54@example.com', '$2y$10$hashedpassword0054', '+85524305904', 'https://t.me/alexandersmith54', NULL, 'Male', '1988-12-11', 'Student', '2025-11-26 16:54:49'),
('Michael Bailey', 'michael.bailey55@example.com', '$2y$10$hashedpassword0055', '+85543446826', 'https://t.me/michaelbailey55', NULL, 'Male', '1995-03-29', 'Student', '2025-08-09 19:20:16'),
('Brenda Kim', 'brenda.kim56@example.com', '$2y$10$hashedpassword0056', '+85552587010', 'https://t.me/brendakim56', NULL, 'Female', '1998-09-28', 'Student', '2025-10-30 15:32:13'),
('Stephen Edwards', 'stephen.edwards57@example.com', '$2y$10$hashedpassword0057', '+85531361812', 'https://t.me/stephenedwards57', NULL, 'Female', '1995-02-04', 'Student', '2024-05-21 23:12:59'),
('Kimberly Foster', 'kimberly.foster58@example.com', '$2y$10$hashedpassword0058', '+85579967676', 'https://t.me/kimberlyfoster58', NULL, 'Male', '1991-02-28', 'Student', '2024-08-08 08:32:15'),
('Paul Nelson', 'paul.nelson59@example.com', '$2y$10$hashedpassword0059', '+85552910691', 'https://t.me/paulnelson59', NULL, 'Male', '1988-02-08', 'Student', '2025-02-23 05:33:48'),
('Raymond Ramirez', 'raymond.ramirez60@example.com', '$2y$10$hashedpassword0060', '+85518620650', 'https://t.me/raymondramirez60', NULL, 'Female', '1997-03-04', 'Student', '2023-05-08 07:31:50'),
('Rebecca Roberts', 'rebecca.roberts61@example.com', '$2y$10$hashedpassword0061', '+85588393811', 'https://t.me/rebeccaroberts61', NULL, 'Male', '2004-03-20', 'Student', '2026-03-25 13:50:57'),
('Kathleen Smith', 'kathleen.smith62@example.com', '$2y$10$hashedpassword0062', '+85557212267', 'https://t.me/kathleensmith62', NULL, 'Female', '2004-02-22', 'Student', '2025-05-08 19:35:45'),
('Catherine Patel', 'catherine.patel63@example.com', '$2y$10$hashedpassword0063', '+85583300637', 'https://t.me/catherinepatel63', NULL, 'Male', '1995-12-14', 'Student', '2025-06-11 17:40:54'),
('Patricia Roberts', 'patricia.roberts64@example.com', '$2y$10$hashedpassword0064', '+85555114543', 'https://t.me/patriciaroberts64', NULL, 'Female', '2001-03-30', 'Student', '2025-08-15 04:38:48'),
('Helen Morgan', 'helen.morgan65@example.com', '$2y$10$hashedpassword0065', '+85513619375', 'https://t.me/helenmorgan65', 'Game Development', 'Other', '1997-08-29', 'Teacher', NULL),
('Samuel Diaz', 'samuel.diaz66@example.com', '$2y$10$hashedpassword0066', '+85528213276', 'https://t.me/samueldiaz66', NULL, 'Male', '1986-02-16', 'Student', '2024-11-01 07:42:22'),
('Ryan Adams', 'ryan.adams67@example.com', '$2y$10$hashedpassword0067', '+85555298556', 'https://t.me/ryanadams67', 'Software Testing', 'Female', '1991-03-30', 'Teacher', '2025-05-13 09:11:05'),
('David Stewart', 'david.stewart68@example.com', '$2y$10$hashedpassword0068', '+85512601580', 'https://t.me/davidstewart68', NULL, 'Male', '1992-11-06', 'Student', '2023-05-21 23:43:46'),
('Jennifer Long', 'jennifer.long69@example.com', '$2y$10$hashedpassword0069', '+85514164775', 'https://t.me/jenniferlong69', 'Web Development', 'Male', '2003-10-28', 'Admin', '2024-05-03 04:35:44'),
('Jacob Bennett', 'jacob.bennett70@example.com', '$2y$10$hashedpassword0070', '+85525353091', 'https://t.me/jacobbennett70', NULL, 'Male', '1995-06-07', 'Student', '2025-01-25 06:06:32'),
('Nicole Cox', 'nicole.cox71@example.com', '$2y$10$hashedpassword0071', '+85525372341', 'https://t.me/nicolecox71', NULL, 'Male', '1991-12-24', 'Student', '2023-02-22 11:21:28'),
('Pamela Gray', 'pamela.gray72@example.com', '$2y$10$hashedpassword0072', '+85560372847', 'https://t.me/pamelagray72', 'Data Science', 'Other', '1989-06-13', 'Admin', '2024-05-12 03:42:36'),
('Rachel Foster', 'rachel.foster73@example.com', '$2y$10$hashedpassword0073', '+85550477742', 'https://t.me/rachelfoster73', NULL, 'Other', '2003-01-25', 'Student', '2026-03-05 01:29:43'),
('Brian Morgan', 'brian.morgan74@example.com', '$2y$10$hashedpassword0074', '+85567495923', 'https://t.me/brianmorgan74', 'Game Development', 'Male', '1996-05-07', 'Admin', '2025-05-10 17:50:51'),
('Susan Parker', 'susan.parker75@example.com', '$2y$10$hashedpassword0075', '+85558612055', 'https://t.me/susanparker75', NULL, 'Female', '2000-11-12', 'Student', '2023-12-27 18:59:46'),
('Katherine Wright', 'katherine.wright76@example.com', '$2y$10$hashedpassword0076', '+85592666356', 'https://t.me/katherinewright76', 'Database Administration', 'Other', '2002-05-17', 'Admin', '2026-04-28 09:46:19'),
('Michelle Young', 'michelle.young77@example.com', '$2y$10$hashedpassword0077', '+85521631697', 'https://t.me/michelleyoung77', NULL, 'Female', '1990-06-21', 'Student', '2026-03-13 22:13:17'),
('Christine Carter', 'christine.carter78@example.com', '$2y$10$hashedpassword0078', '+85555150390', NULL, 'Database Administration', 'Female', '1989-01-29', 'Teacher', '2024-06-13 12:23:28'),
('Kimberly Kim', 'kimberly.kim79@example.com', '$2y$10$hashedpassword0079', '+85547080140', 'https://t.me/kimberlykim79', 'Data Science', 'Other', '1989-04-15', 'Teacher', '2025-04-12 17:47:18'),
('Brenda Ross', 'brenda.ross80@example.com', '$2y$10$hashedpassword0080', '+85542255732', 'https://t.me/brendaross80', 'Database Administration', 'Other', '2000-12-19', 'Teacher', '2023-02-05 03:23:16'),
('Emily Lewis', 'emily.lewis81@example.com', '$2y$10$hashedpassword0081', '+85564277800', 'https://t.me/emilylewis81', NULL, 'Female', '1999-11-23', 'Student', '2025-08-27 20:09:04'),
('Shirley Hall', 'shirley.hall82@example.com', '$2y$10$hashedpassword0082', '+85567110154', 'https://t.me/shirleyhall82', NULL, 'Other', '1992-06-02', 'Student', '2025-07-18 09:51:49'),
('Donna Allen', 'donna.allen83@example.com', '$2y$10$hashedpassword0083', '+85540942292', NULL, NULL, 'Male', '1992-01-29', 'Student', '2026-01-02 06:44:27'),
('Matthew Ramirez', 'matthew.ramirez84@example.com', '$2y$10$hashedpassword0084', '+85574988034', 'https://t.me/matthewramirez84', 'Network Engineering', 'Other', '2002-01-19', 'Admin', '2023-07-25 07:04:03'),
('Emily Robinson', 'emily.robinson85@example.com', '$2y$10$hashedpassword0085', '+85558436637', NULL, 'Network Engineering', 'Male', '2000-11-18', 'Admin', '2023-04-04 01:59:06'),
('Stephen Nguyen', 'stephen.nguyen86@example.com', '$2y$10$hashedpassword0086', '+85526948946', 'https://t.me/stephennguyen86', NULL, 'Female', '1987-04-21', 'Student', '2026-03-21 10:21:08'),
('Jacob Morris', 'jacob.morris87@example.com', '$2y$10$hashedpassword0087', '+85569118721', 'https://t.me/jacobmorris87', NULL, 'Male', '1990-08-31', 'Student', '2025-09-05 04:09:13'),
('William Phillips', 'william.phillips88@example.com', '$2y$10$hashedpassword0088', '+85576001106', NULL, 'Web Development', 'Other', '2000-05-25', 'Teacher', '2026-02-26 11:03:44'),
('David Young', 'david.young89@example.com', '$2y$10$hashedpassword0089', '+85525898299', 'https://t.me/davidyoung89', NULL, 'Female', '1998-08-07', 'Student', '2026-06-20 08:13:01'),
('Heather Gutierrez', 'heather.gutierrez90@example.com', '$2y$10$hashedpassword0090', '+85561053474', 'https://t.me/heathergutierrez90', NULL, 'Female', '1991-09-02', 'Student', '2025-05-28 11:07:06'),
('Larry Richardson', 'larry.richardson91@example.com', '$2y$10$hashedpassword0091', '+85518083974', 'https://t.me/larryrichardson91', 'Software Testing', 'Other', '1987-03-24', 'Admin', '2024-03-08 09:38:07'),
('Gregory Hernandez', 'gregory.hernandez92@example.com', '$2y$10$hashedpassword0092', '+85531079846', 'https://t.me/gregoryhernandez92', NULL, 'Other', '1986-09-07', 'Student', '2025-04-16 16:24:08'),
('Alexander Kim', 'alexander.kim93@example.com', '$2y$10$hashedpassword0093', '+85573070585', 'https://t.me/alexanderkim93', NULL, 'Male', '1991-06-19', 'Student', '2025-07-18 02:35:29'),
('Debra Robinson', 'debra.robinson94@example.com', '$2y$10$hashedpassword0094', '+85545507920', 'https://t.me/debrarobinson94', NULL, 'Other', '1998-03-25', 'Student', '2024-02-10 15:28:43'),
('Joseph Cooper', 'joseph.cooper95@example.com', '$2y$10$hashedpassword0095', '+85540173413', 'https://t.me/josephcooper95', NULL, 'Female', '2003-07-17', 'Student', '2023-05-03 06:02:27'),
('Donna Kim', 'donna.kim96@example.com', '$2y$10$hashedpassword0096', '+85586397676', 'https://t.me/donnakim96', NULL, 'Female', '1987-10-16', 'Student', '2024-09-14 14:39:17'),
('Paul Cook', 'paul.cook97@example.com', '$2y$10$hashedpassword0097', '+85582475098', 'https://t.me/paulcook97', 'Web Development', 'Male', '1998-06-01', 'Admin', '2024-10-22 21:58:49'),
('Steven Brown', 'steven.brown98@example.com', '$2y$10$hashedpassword0098', '+85522257687', 'https://t.me/stevenbrown98', NULL, 'Other', '2003-10-02', 'Student', '2026-04-17 00:45:19'),
('Maria Gray', 'maria.gray99@example.com', '$2y$10$hashedpassword0099', '+85546173157', 'https://t.me/mariagray99', NULL, 'Male', '1995-07-22', 'Student', '2025-06-24 10:07:38'),
('Lisa Howard', 'lisa.howard100@example.com', '$2y$10$hashedpassword0100', '+85568503492', 'https://t.me/lisahoward100', 'Database Administration', 'Female', '1987-01-18', 'Teacher', '2024-11-13 11:41:21');

-- ---------- CATEGORY (100) ----------
INSERT INTO Category (category_name, description) VALUES
('Web Development', 'Courses related to web development concepts and practical skills.'),
('Data Science', 'Courses related to data science concepts and practical skills.'),
('Mobile Development', 'Courses related to mobile development concepts and practical skills.'),
('Cybersecurity', 'Courses related to cybersecurity concepts and practical skills.'),
('Cloud Computing', 'Courses related to cloud computing concepts and practical skills.'),
('Artificial Intelligence', 'Courses related to artificial intelligence concepts and practical skills.'),
('UI/UX Design', 'Courses related to ui/ux design concepts and practical skills.'),
('Database Administration', 'Courses related to database administration concepts and practical skills.'),
('Network Engineering', 'Courses related to network engineering concepts and practical skills.'),
('DevOps', 'Courses related to devops concepts and practical skills.'),
('Game Development', 'Courses related to game development concepts and practical skills.'),
('Machine Learning', 'Courses related to machine learning concepts and practical skills.'),
('Software Testing', 'Courses related to software testing concepts and practical skills.'),
('Project Management', 'Courses related to project management concepts and practical skills.'),
('Business Analysis', 'Courses related to business analysis concepts and practical skills.'),
('Digital Marketing', 'Courses related to digital marketing concepts and practical skills.'),
('Graphic Design', 'Courses related to graphic design concepts and practical skills.'),
('Cloud Security', 'Courses related to cloud security concepts and practical skills.'),
('Blockchain Development', 'Courses related to blockchain development concepts and practical skills.'),
('IT Support', 'Courses related to it support concepts and practical skills.'),
('Embedded Systems', 'Courses related to embedded systems concepts and practical skills.'),
('Robotics', 'Courses related to robotics concepts and practical skills.'),
('E-commerce Development', 'Courses related to e-commerce development concepts and practical skills.'),
('Backend Development', 'Courses related to backend development concepts and practical skills.'),
('Frontend Development', 'Courses related to frontend development concepts and practical skills.'),
('Web Development 2', 'Courses related to web development concepts and practical skills.'),
('Data Science 2', 'Courses related to data science concepts and practical skills.'),
('Mobile Development 2', 'Courses related to mobile development concepts and practical skills.'),
('Cybersecurity 2', 'Courses related to cybersecurity concepts and practical skills.'),
('Cloud Computing 2', 'Courses related to cloud computing concepts and practical skills.'),
('Artificial Intelligence 2', 'Courses related to artificial intelligence concepts and practical skills.'),
('UI/UX Design 2', 'Courses related to ui/ux design concepts and practical skills.'),
('Database Administration 2', 'Courses related to database administration concepts and practical skills.'),
('Network Engineering 2', 'Courses related to network engineering concepts and practical skills.'),
('DevOps 2', 'Courses related to devops concepts and practical skills.'),
('Game Development 2', 'Courses related to game development concepts and practical skills.'),
('Machine Learning 2', 'Courses related to machine learning concepts and practical skills.'),
('Software Testing 2', 'Courses related to software testing concepts and practical skills.'),
('Project Management 2', 'Courses related to project management concepts and practical skills.'),
('Business Analysis 2', 'Courses related to business analysis concepts and practical skills.'),
('Digital Marketing 2', 'Courses related to digital marketing concepts and practical skills.'),
('Graphic Design 2', 'Courses related to graphic design concepts and practical skills.'),
('Cloud Security 2', 'Courses related to cloud security concepts and practical skills.'),
('Blockchain Development 2', 'Courses related to blockchain development concepts and practical skills.'),
('IT Support 2', 'Courses related to it support concepts and practical skills.'),
('Embedded Systems 2', 'Courses related to embedded systems concepts and practical skills.'),
('Robotics 2', 'Courses related to robotics concepts and practical skills.'),
('E-commerce Development 2', 'Courses related to e-commerce development concepts and practical skills.'),
('Backend Development 2', 'Courses related to backend development concepts and practical skills.'),
('Frontend Development 2', 'Courses related to frontend development concepts and practical skills.'),
('Web Development 3', 'Courses related to web development concepts and practical skills.'),
('Data Science 3', 'Courses related to data science concepts and practical skills.'),
('Mobile Development 3', 'Courses related to mobile development concepts and practical skills.'),
('Cybersecurity 3', 'Courses related to cybersecurity concepts and practical skills.'),
('Cloud Computing 3', 'Courses related to cloud computing concepts and practical skills.'),
('Artificial Intelligence 3', 'Courses related to artificial intelligence concepts and practical skills.'),
('UI/UX Design 3', 'Courses related to ui/ux design concepts and practical skills.'),
('Database Administration 3', 'Courses related to database administration concepts and practical skills.'),
('Network Engineering 3', 'Courses related to network engineering concepts and practical skills.'),
('DevOps 3', 'Courses related to devops concepts and practical skills.'),
('Game Development 3', 'Courses related to game development concepts and practical skills.'),
('Machine Learning 3', 'Courses related to machine learning concepts and practical skills.'),
('Software Testing 3', 'Courses related to software testing concepts and practical skills.'),
('Project Management 3', 'Courses related to project management concepts and practical skills.'),
('Business Analysis 3', 'Courses related to business analysis concepts and practical skills.'),
('Digital Marketing 3', 'Courses related to digital marketing concepts and practical skills.'),
('Graphic Design 3', 'Courses related to graphic design concepts and practical skills.'),
('Cloud Security 3', 'Courses related to cloud security concepts and practical skills.'),
('Blockchain Development 3', 'Courses related to blockchain development concepts and practical skills.'),
('IT Support 3', 'Courses related to it support concepts and practical skills.'),
('Embedded Systems 3', 'Courses related to embedded systems concepts and practical skills.'),
('Robotics 3', 'Courses related to robotics concepts and practical skills.'),
('E-commerce Development 3', 'Courses related to e-commerce development concepts and practical skills.'),
('Backend Development 3', 'Courses related to backend development concepts and practical skills.'),
('Frontend Development 3', 'Courses related to frontend development concepts and practical skills.'),
('Web Development 4', 'Courses related to web development concepts and practical skills.'),
('Data Science 4', 'Courses related to data science concepts and practical skills.'),
('Mobile Development 4', 'Courses related to mobile development concepts and practical skills.'),
('Cybersecurity 4', 'Courses related to cybersecurity concepts and practical skills.'),
('Cloud Computing 4', 'Courses related to cloud computing concepts and practical skills.'),
('Artificial Intelligence 4', 'Courses related to artificial intelligence concepts and practical skills.'),
('UI/UX Design 4', 'Courses related to ui/ux design concepts and practical skills.'),
('Database Administration 4', 'Courses related to database administration concepts and practical skills.'),
('Network Engineering 4', 'Courses related to network engineering concepts and practical skills.'),
('DevOps 4', 'Courses related to devops concepts and practical skills.'),
('Game Development 4', 'Courses related to game development concepts and practical skills.'),
('Machine Learning 4', 'Courses related to machine learning concepts and practical skills.'),
('Software Testing 4', 'Courses related to software testing concepts and practical skills.'),
('Project Management 4', 'Courses related to project management concepts and practical skills.'),
('Business Analysis 4', 'Courses related to business analysis concepts and practical skills.'),
('Digital Marketing 4', 'Courses related to digital marketing concepts and practical skills.'),
('Graphic Design 4', 'Courses related to graphic design concepts and practical skills.'),
('Cloud Security 4', 'Courses related to cloud security concepts and practical skills.'),
('Blockchain Development 4', 'Courses related to blockchain development concepts and practical skills.'),
('IT Support 4', 'Courses related to it support concepts and practical skills.'),
('Embedded Systems 4', 'Courses related to embedded systems concepts and practical skills.'),
('Robotics 4', 'Courses related to robotics concepts and practical skills.'),
('E-commerce Development 4', 'Courses related to e-commerce development concepts and practical skills.'),
('Backend Development 4', 'Courses related to backend development concepts and practical skills.'),
('Frontend Development 4', 'Courses related to frontend development concepts and practical skills.');

-- ---------- COURSE (100) ----------
-- price: INT, 70% = 0 (free), 30% random between 15 and 150
-- video_id: REAL YouTube video IDs (verified via web search), unique, tech-related
INSERT INTO course (title, description, sub_description, category_id, video_id, duration, status, user_id, price) VALUES
('Practical DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A comprehensive course on devops.', 13, 'YSkDtQ2RA_c', 129, 'Active', 46, 43),
('Practical DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A concise course on devops.', 60, '4XtVUwLvXN8', 85, 'Active', 83, 0),
('Mastering Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A comprehensive course on web development.', 52, 'ITSMDeOgXxw', 377, 'Inactive', 14, 142),
('Complete Guide to Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A comprehensive course on web development.', 25, 'nu_pCVPKzTk', 579, 'Active', 55, 0),
('Advanced Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A concise course on software development.', 60, 'IqqKqHfW2SI', 285, 'Inactive', 10, 0),
('Beginner''s Guide to Database Administration', 'This course covers everything you need to know about database administration, from basics to advanced topics.', 'A practical course on database administration.', 13, 'NTgejLheGeU', 81, 'Active', 70, 38),
('Introduction to Data Science', 'This course covers everything you need to know about data science, from basics to advanced topics.', 'A comprehensive course on data science.', 97, 'gDZ6czwuQ18', 272, 'Active', 63, 0),
('Beginner''s Guide to Game Development', 'This course covers everything you need to know about game development, from basics to advanced topics.', 'A comprehensive course on game development.', 52, 'AZHs-DtBf4c', 90, 'Active', 1, 0),
('Practical Network Engineering', 'This course covers everything you need to know about network engineering, from basics to advanced topics.', 'A concise course on network engineering.', 59, 'fErDcUtd8fA', 322, 'Active', 94, 0),
('Deep Dive into Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A practical course on project management.', 92, '9V1tpRaEBaw', 528, 'Active', 38, 0),
('Complete Guide to Cybersecurity', 'This course covers everything you need to know about cybersecurity, from basics to advanced topics.', 'A comprehensive course on cybersecurity.', 75, 'NjvR4LmwcMU', 585, 'Active', 41, 123),
('Introduction to Artificial Intelligence', 'This course covers everything you need to know about artificial intelligence, from basics to advanced topics.', 'A comprehensive course on artificial intelligence.', 75, 'JMUxmLyrhSk', 518, 'Active', 68, 0),
('Advanced Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A comprehensive course on software development.', 66, 'axPHp31_B2Y', 112, 'Inactive', 9, 0),
('Professional Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A comprehensive course on machine learning.', 87, 'vkaGklIM7k8', 270, 'Active', 73, 0),
('Complete Guide to Software Testing', 'This course covers everything you need to know about software testing, from basics to advanced topics.', 'A practical course on software testing.', 77, 'E2t5XbWwj7I', 70, 'Active', 54, 82),
('Professional Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A practical course on machine learning.', 67, 'rfc47UgajHM', 353, 'Draft', 27, 124),
('Hands-on UI/UX Design', 'This course covers everything you need to know about ui/ux design, from basics to advanced topics.', 'A comprehensive course on ui/ux design.', 34, '1SNZRCVNizg', 435, 'Active', 83, 0),
('Fundamentals of Database Administration', 'This course covers everything you need to know about database administration, from basics to advanced topics.', 'A concise course on database administration.', 41, '7S_tz1z_5bA', 104, 'Active', 80, 0),
('Professional Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A comprehensive course on project management.', 10, 'pc9nvBsXsuM', 580, 'Active', 34, 150),
('Advanced Network Engineering', 'This course covers everything you need to know about network engineering, from basics to advanced topics.', 'A concise course on network engineering.', 9, '0PbTi_Prpgs', 280, 'Active', 21, 0),
('Beginner''s Guide to Cloud Computing', 'This course covers everything you need to know about cloud computing, from basics to advanced topics.', 'A practical course on cloud computing.', 91, '2FrrGNCVopg', 339, 'Active', 84, 0),
('Deep Dive into Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A comprehensive course on project management.', 86, '9yhWD341Xdg', 597, 'Active', 85, 69),
('Mastering Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A comprehensive course on machine learning.', 34, 'TNWNxHYwhuk', 148, 'Inactive', 96, 0),
('Deep Dive into Game Development', 'This course covers everything you need to know about game development, from basics to advanced topics.', 'A comprehensive course on game development.', 35, 'XtQMytORBmM', 318, 'Active', 92, 0),
('Hands-on DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A comprehensive course on devops.', 88, '5KtRF4NuUWE', 300, 'Active', 33, 0),
('Introduction to Network Engineering', 'This course covers everything you need to know about network engineering, from basics to advanced topics.', 'A comprehensive course on network engineering.', 82, 'oHQvWa6J8dU', 463, 'Inactive', 6, 0),
('Introduction to Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A concise course on web development.', 99, 'ZxKM3DCV2kE', 163, 'Active', 34, 79),
('Advanced Mobile Development', 'This course covers everything you need to know about mobile development, from basics to advanced topics.', 'A practical course on mobile development.', 57, 'CzRQ9mnmh44', 594, 'Active', 72, 0),
('Introduction to Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A comprehensive course on machine learning.', 10, 'jOIKxfHJuNs', 182, 'Active', 48, 95),
('Professional Cloud Computing', 'This course covers everything you need to know about cloud computing, from basics to advanced topics.', 'A practical course on cloud computing.', 19, 'T_XRhFobwqU', 470, 'Active', 40, 0),
('Hands-on DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A comprehensive course on devops.', 46, 'Bd0N2iQ8gCc', 245, 'Active', 86, 31),
('Mastering Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A concise course on web development.', 100, '3TrRivP8KDk', 446, 'Draft', 96, 0),
('Advanced UI/UX Design', 'This course covers everything you need to know about ui/ux design, from basics to advanced topics.', 'A comprehensive course on ui/ux design.', 21, 'HoKD1qIcchQ', 211, 'Inactive', 4, 116),
('Advanced DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A practical course on devops.', 43, 'hQcFE0RD0cQ', 451, 'Inactive', 95, 0),
('Complete Guide to Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A concise course on software development.', 21, '7yf6676xMhM', 140, 'Active', 5, 0),
('Beginner''s Guide to Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A comprehensive course on project management.', 26, 'JIKyxfZrsx4', 501, 'Active', 30, 51),
('Complete Guide to Data Science', 'This course covers everything you need to know about data science, from basics to advanced topics.', 'A comprehensive course on data science.', 85, '-ETQ97mXXF0', 227, 'Active', 36, 132),
('Mastering UI/UX Design', 'This course covers everything you need to know about ui/ux design, from basics to advanced topics.', 'A concise course on ui/ux design.', 45, 'jQ1sfKIl50E', 551, 'Active', 69, 0),
('Hands-on UI/UX Design', 'This course covers everything you need to know about ui/ux design, from basics to advanced topics.', 'A comprehensive course on ui/ux design.', 15, '31wzhvz0vsw', 297, 'Active', 34, 0),
('Introduction to Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A comprehensive course on project management.', 77, '6LJLIfRfrts', 474, 'Active', 41, 78),
('Practical Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A practical course on software development.', 66, 'pz8xou3zceE', 148, 'Active', 74, 0),
('Complete Guide to Network Engineering', 'This course covers everything you need to know about network engineering, from basics to advanced topics.', 'A concise course on network engineering.', 6, 'GtUll7yuZtQ', 476, 'Active', 69, 50),
('Complete Guide to Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A concise course on business analysis.', 56, 'czymrnQV2p4', 101, 'Draft', 43, 107),
('Professional DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A concise course on devops.', 85, 'S_0q75eD8Yc', 157, 'Active', 39, 0),
('Deep Dive into Artificial Intelligence', 'This course covers everything you need to know about artificial intelligence, from basics to advanced topics.', 'A concise course on artificial intelligence.', 86, 'nJ25yl34Uqw', 448, 'Active', 90, 0),
('Fundamentals of Mobile Development', 'This course covers everything you need to know about mobile development, from basics to advanced topics.', 'A practical course on mobile development.', 17, 'pTJJsmejUOQ', 226, 'Active', 49, 0),
('Advanced Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A practical course on machine learning.', 73, 'pYpFvmOx9_U', 338, 'Active', 1, 0),
('Fundamentals of Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A concise course on machine learning.', 27, 'Q7vlEb3ctn8', 470, 'Active', 78, 0),
('Hands-on Mobile Development', 'This course covers everything you need to know about mobile development, from basics to advanced topics.', 'A concise course on mobile development.', 57, 'u64gyCdqawU', 482, 'Active', 66, 0),
('Beginner''s Guide to Game Development', 'This course covers everything you need to know about game development, from basics to advanced topics.', 'A practical course on game development.', 22, 'gB1F9G0JXOo', 116, 'Active', 85, 0),
('Professional Data Science', 'This course covers everything you need to know about data science, from basics to advanced topics.', 'A concise course on data science.', 12, 'lGToag98-8k', 270, 'Active', 29, 0),
('Complete Guide to Cybersecurity', 'This course covers everything you need to know about cybersecurity, from basics to advanced topics.', 'A comprehensive course on cybersecurity.', 4, 's19BxFpoSd0', 77, 'Active', 61, 112),
('Professional Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A comprehensive course on web development.', 59, 'SaKpzjsXSqg', 454, 'Inactive', 74, 0),
('Complete Guide to Artificial Intelligence', 'This course covers everything you need to know about artificial intelligence, from basics to advanced topics.', 'A practical course on artificial intelligence.', 90, 'MqffbpjhriQ', 423, 'Active', 32, 0),
('Advanced Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A practical course on business analysis.', 89, 'YK_4SC1ZcWM', 35, 'Inactive', 99, 0),
('Mastering UI/UX Design', 'This course covers everything you need to know about ui/ux design, from basics to advanced topics.', 'A concise course on ui/ux design.', 29, 'mT_Jjn8RJdo', 210, 'Inactive', 90, 0),
('Deep Dive into Data Science', 'This course covers everything you need to know about data science, from basics to advanced topics.', 'A concise course on data science.', 7, 'ua-CiDNNj30', 600, 'Active', 16, 0),
('Beginner''s Guide to Database Administration', 'This course covers everything you need to know about database administration, from basics to advanced topics.', 'A comprehensive course on database administration.', 60, 'HXV3zeQKqGY', 573, 'Draft', 77, 50),
('Hands-on Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A concise course on web development.', 79, 'o1fjWjReodE', 546, 'Active', 71, 0),
('Beginner''s Guide to Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A comprehensive course on machine learning.', 96, '53mqteI5TS0', 516, 'Active', 97, 0),
('Complete Guide to DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A practical course on devops.', 36, 'tLg2p45ztJI', 563, 'Active', 31, 0),
('Fundamentals of Game Development', 'This course covers everything you need to know about game development, from basics to advanced topics.', 'A concise course on game development.', 10, 'L-81sc7Alx4', 322, 'Active', 43, 0),
('Hands-on Mobile Development', 'This course covers everything you need to know about mobile development, from basics to advanced topics.', 'A practical course on mobile development.', 11, 'TclK5gNM_PM', 171, 'Active', 50, 0),
('Advanced Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A practical course on web development.', 28, 'kJEsTjH5mVg', 95, 'Active', 43, 0),
('Deep Dive into UI/UX Design', 'This course covers everything you need to know about ui/ux design, from basics to advanced topics.', 'A concise course on ui/ux design.', 54, 'IOVFRMuPeVQ', 93, 'Active', 54, 0),
('Practical Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A practical course on project management.', 90, 'YA05u1fpX2k', 50, 'Inactive', 98, 0),
('Professional Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A concise course on business analysis.', 62, 'znpV1z0rQLc', 36, 'Draft', 39, 27),
('Practical Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A concise course on project management.', 69, '8zrqJ68I7BI', 589, 'Active', 29, 0),
('Beginner''s Guide to Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A comprehensive course on project management.', 35, '_XVueoA3VdA', 476, 'Active', 50, 0),
('Hands-on Mobile Development', 'This course covers everything you need to know about mobile development, from basics to advanced topics.', 'A practical course on mobile development.', 87, '1iaimCQHeHw', 444, 'Active', 60, 0),
('Advanced Software Testing', 'This course covers everything you need to know about software testing, from basics to advanced topics.', 'A practical course on software testing.', 69, 'IPkjfT-mb1U', 57, 'Draft', 76, 71),
('Professional Machine Learning', 'This course covers everything you need to know about machine learning, from basics to advanced topics.', 'A practical course on machine learning.', 4, 'xsR8B3K_w-0', 115, 'Active', 18, 0),
('Beginner''s Guide to Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A comprehensive course on business analysis.', 7, 'pr-ly3UJB6w', 296, 'Active', 28, 0),
('Beginner''s Guide to Mobile Development', 'This course covers everything you need to know about mobile development, from basics to advanced topics.', 'A concise course on mobile development.', 44, 'DsTMhjaRQws', 418, 'Active', 54, 145),
('Fundamentals of Data Science', 'This course covers everything you need to know about data science, from basics to advanced topics.', 'A comprehensive course on data science.', 61, 'xiEC5oFsq2s', 49, 'Active', 7, 0),
('Hands-on Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A comprehensive course on software development.', 84, 'QpJxezqllJA', 100, 'Active', 84, 0),
('Introduction to Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A comprehensive course on business analysis.', 32, '1QKIvt05LmA', 234, 'Inactive', 80, 0),
('Advanced Network Engineering', 'This course covers everything you need to know about network engineering, from basics to advanced topics.', 'A comprehensive course on network engineering.', 17, 'Ndp_UTAV-SE', 514, 'Active', 73, 82),
('Complete Guide to Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A concise course on software development.', 90, 'CFD9EFcNZTQ', 292, 'Active', 22, 0),
('Professional Database Administration', 'This course covers everything you need to know about database administration, from basics to advanced topics.', 'A practical course on database administration.', 96, 'BPHAr4QGGVE', 147, 'Active', 21, 0),
('Fundamentals of Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A comprehensive course on business analysis.', 75, '68bWRSO8PYc', 56, 'Draft', 74, 54),
('Practical Cybersecurity', 'This course covers everything you need to know about cybersecurity, from basics to advanced topics.', 'A concise course on cybersecurity.', 92, 'hxXbvu9J5Pg', 233, 'Active', 89, 0),
('Complete Guide to Game Development', 'This course covers everything you need to know about game development, from basics to advanced topics.', 'A comprehensive course on game development.', 90, 'AmGSEH7QcDg', 338, 'Inactive', 77, 0),
('Mastering Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A practical course on project management.', 6, 'mtCysJcvJPc', 385, 'Active', 85, 0),
('Hands-on Software Testing', 'This course covers everything you need to know about software testing, from basics to advanced topics.', 'A comprehensive course on software testing.', 65, 'oOvURgHcd4w', 379, 'Active', 54, 0),
('Beginner''s Guide to DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A comprehensive course on devops.', 56, 'QameL1KtnmI', 400, 'Active', 59, 0),
('Advanced Cloud Computing', 'This course covers everything you need to know about cloud computing, from basics to advanced topics.', 'A concise course on cloud computing.', 23, 'tDuruX7XSac', 564, 'Draft', 35, 0),
('Professional Cloud Computing', 'This course covers everything you need to know about cloud computing, from basics to advanced topics.', 'A practical course on cloud computing.', 100, 'GlLskMrxuhY', 525, 'Active', 94, 0),
('Professional Business Analysis', 'This course covers everything you need to know about business analysis, from basics to advanced topics.', 'A concise course on business analysis.', 42, '2GRu7A4adMk', 281, 'Inactive', 12, 0),
('Fundamentals of Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A concise course on software development.', 32, 'Ae-r8hsbPUo', 505, 'Active', 86, 113),
('Practical Data Science', 'This course covers everything you need to know about data science, from basics to advanced topics.', 'A concise course on data science.', 4, 'J9XaINbYBig', 536, 'Inactive', 24, 0),
('Beginner''s Guide to Database Administration', 'This course covers everything you need to know about database administration, from basics to advanced topics.', 'A comprehensive course on database administration.', 46, 'q_JsgpiuY98', 294, 'Active', 77, 117),
('Fundamentals of Software Testing', 'This course covers everything you need to know about software testing, from basics to advanced topics.', 'A practical course on software testing.', 2, 'sO8eGL6SFsA', 559, 'Draft', 11, 0),
('Complete Guide to Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A practical course on web development.', 53, '1-Wgl_Cj2Ok', 530, 'Active', 31, 0),
('Beginner''s Guide to DevOps', 'This course covers everything you need to know about devops, from basics to advanced topics.', 'A practical course on devops.', 92, '12HwsqHoaE8', 532, 'Active', 3, 134),
('Mastering Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A concise course on software development.', 29, 'vBaA0aYe1jw', 444, 'Active', 40, 0),
('Professional Project Management', 'This course covers everything you need to know about project management, from basics to advanced topics.', 'A concise course on project management.', 61, 'F5pu48r36CA', 596, 'Active', 55, 55),
('Deep Dive into Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A concise course on web development.', 46, 'WGJJIrtnfpk', 494, 'Active', 33, 141),
('Complete Guide to Software Development', 'This course covers everything you need to know about software development, from basics to advanced topics.', 'A comprehensive course on software development.', 93, '2qr7gHNErIk', 227, 'Active', 96, 0),
('Deep Dive into Web Development', 'This course covers everything you need to know about web development, from basics to advanced topics.', 'A practical course on web development.', 24, 'EK_HYyZeGAI', 226, 'Active', 62, 69);

-- ---------- ENROLLMENT (100) ----------
INSERT INTO enrollment (user_id, course_id, status, last_watched, enrolled_at, completed_at, cancelled_at) VALUES
(68, 55, 'Enrolled', '2023-04-08 08:40:52', '2024-08-13 08:39:07', NULL, NULL),
(54, 82, 'Completed', NULL, '2025-07-25 02:17:12', '2025-10-20 21:43:35', NULL),
(69, 3, 'Completed', '2024-08-19 15:37:41', '2026-03-23 08:48:31', '2023-01-04 22:23:04', NULL),
(46, 31, 'Enrolled', '2025-01-08 02:27:50', '2024-01-19 03:07:01', NULL, NULL),
(68, 70, 'Enrolled', NULL, '2025-11-05 20:10:33', NULL, NULL),
(61, 6, 'Completed', '2025-01-01 02:27:35', '2025-02-03 09:14:06', '2024-12-07 08:46:44', NULL),
(94, 85, 'Completed', NULL, '2026-04-06 12:06:23', '2024-12-22 19:52:47', NULL),
(44, 83, 'Enrolled', '2023-10-04 02:17:50', '2025-08-09 17:25:22', NULL, NULL),
(92, 100, 'Cancelled', '2024-02-13 01:31:32', '2023-03-17 10:41:02', NULL, '2024-10-08 11:17:22'),
(66, 51, 'Cancelled', '2024-01-27 10:25:01', '2026-01-17 17:14:09', NULL, '2025-01-01 01:44:25'),
(84, 43, 'Enrolled', '2025-06-19 14:04:38', '2025-01-23 15:54:32', NULL, NULL),
(44, 24, 'Enrolled', '2025-11-29 09:42:39', '2025-10-15 13:22:28', NULL, NULL),
(11, 94, 'Enrolled', '2024-01-05 19:51:36', '2025-05-31 21:56:04', NULL, NULL),
(38, 42, 'Enrolled', '2026-05-19 15:30:51', '2024-11-02 10:45:50', NULL, NULL),
(22, 89, 'Enrolled', '2024-12-23 22:23:09', '2025-07-04 01:32:31', NULL, NULL),
(56, 36, 'Completed', '2025-04-11 13:13:39', '2023-04-28 02:43:55', '2025-11-16 05:49:29', NULL),
(4, 19, 'Completed', NULL, '2025-06-16 01:16:01', '2024-04-28 23:29:22', NULL),
(47, 47, 'Enrolled', '2025-07-10 13:30:23', '2026-03-07 01:10:44', NULL, NULL),
(48, 57, 'Completed', '2025-03-26 11:26:47', '2026-03-21 05:00:47', '2024-07-24 09:05:17', NULL),
(15, 4, 'Completed', '2026-02-24 04:17:15', '2025-10-19 18:51:01', '2024-06-20 09:28:36', NULL),
(91, 58, 'Enrolled', '2025-10-02 07:17:17', '2026-06-07 10:23:51', NULL, NULL),
(16, 18, 'Completed', '2025-06-30 03:11:46', '2025-07-14 06:17:10', '2024-10-16 12:38:57', NULL),
(91, 9, 'Enrolled', '2023-12-23 13:09:41', '2024-08-17 10:55:15', NULL, NULL),
(66, 29, 'Enrolled', '2025-10-08 00:57:25', '2024-02-16 05:03:22', NULL, NULL),
(47, 71, 'Enrolled', NULL, '2025-08-15 20:05:05', NULL, NULL),
(12, 9, 'Enrolled', '2025-04-18 20:55:53', '2025-09-07 19:08:23', NULL, NULL),
(10, 17, 'Cancelled', '2025-11-25 12:32:36', '2023-06-01 16:22:59', NULL, '2023-09-20 20:04:20'),
(82, 76, 'Enrolled', '2023-04-24 04:31:14', '2023-09-22 15:45:04', NULL, NULL),
(67, 20, 'Enrolled', '2024-04-06 12:35:53', '2023-11-28 11:44:51', NULL, NULL),
(67, 37, 'Completed', '2026-02-02 09:59:32', '2024-05-28 07:08:49', '2023-09-14 22:45:22', NULL),
(39, 79, 'Enrolled', NULL, '2025-10-26 23:20:15', NULL, NULL),
(75, 20, 'Enrolled', '2026-02-28 01:29:59', '2026-05-24 12:17:32', NULL, NULL),
(4, 11, 'Enrolled', '2026-03-17 15:10:02', '2026-03-27 09:38:08', NULL, NULL),
(80, 82, 'Enrolled', '2024-09-10 17:35:00', '2026-01-22 10:32:47', NULL, NULL),
(32, 88, 'Enrolled', '2023-11-20 16:00:19', '2025-07-17 02:39:24', NULL, NULL),
(54, 62, 'Enrolled', NULL, '2024-11-27 22:05:16', NULL, NULL),
(92, 41, 'Completed', NULL, '2024-12-08 14:31:00', '2025-01-28 18:44:59', NULL),
(72, 14, 'Enrolled', '2024-05-22 05:07:45', '2025-08-13 04:27:39', NULL, NULL),
(13, 7, 'Enrolled', '2023-11-24 11:55:17', '2025-02-25 22:24:18', NULL, NULL),
(74, 93, 'Enrolled', '2025-08-14 18:09:33', '2023-11-23 18:08:28', NULL, NULL),
(40, 64, 'Enrolled', '2024-05-08 07:49:59', '2025-03-16 18:24:09', NULL, NULL),
(75, 46, 'Enrolled', '2025-08-21 10:24:13', '2024-07-30 18:01:06', NULL, NULL),
(69, 2, 'Completed', '2025-01-19 14:40:55', '2025-06-01 04:52:35', '2025-01-19 01:38:50', NULL),
(52, 7, 'Enrolled', '2023-05-31 14:03:59', '2024-02-03 13:11:56', NULL, NULL),
(65, 58, 'Completed', '2023-09-01 04:41:04', '2024-07-26 22:41:29', '2023-07-18 14:20:29', NULL),
(48, 44, 'Enrolled', NULL, '2025-01-18 05:15:09', NULL, NULL),
(66, 52, 'Enrolled', NULL, '2023-04-03 01:25:00', NULL, NULL),
(43, 61, 'Enrolled', '2023-10-14 11:56:27', '2023-11-02 22:04:23', NULL, NULL),
(79, 41, 'Enrolled', '2025-11-04 18:33:29', '2026-06-16 10:53:41', NULL, NULL),
(69, 63, 'Completed', '2025-01-24 12:03:36', '2024-09-05 17:17:25', '2023-08-13 15:09:56', NULL),
(75, 40, 'Completed', '2026-03-30 21:01:51', '2023-02-24 21:43:58', '2024-04-11 01:52:11', NULL),
(75, 62, 'Enrolled', NULL, '2026-06-23 13:50:32', NULL, NULL),
(88, 32, 'Enrolled', NULL, '2023-08-14 06:56:46', NULL, NULL),
(41, 54, 'Enrolled', '2026-06-06 17:10:14', '2024-02-22 14:56:28', NULL, NULL),
(95, 94, 'Enrolled', '2024-10-27 17:25:01', '2023-10-10 18:53:04', NULL, NULL),
(68, 49, 'Enrolled', '2024-12-02 19:53:21', '2023-12-21 16:44:09', NULL, NULL),
(46, 87, 'Completed', '2024-05-19 10:09:29', '2024-06-25 22:12:43', '2026-02-16 10:52:04', NULL),
(29, 39, 'Completed', '2024-12-15 20:24:24', '2024-02-29 17:48:14', '2024-07-14 10:28:41', NULL),
(16, 74, 'Completed', '2023-10-27 10:34:30', '2025-02-16 14:21:52', '2023-03-28 10:28:20', NULL),
(92, 11, 'Enrolled', '2025-09-08 07:47:27', '2025-06-24 23:52:59', NULL, NULL),
(26, 69, 'Enrolled', NULL, '2026-02-25 09:53:21', NULL, NULL),
(79, 95, 'Enrolled', '2025-12-23 08:12:59', '2024-05-11 01:50:53', NULL, NULL),
(82, 30, 'Enrolled', '2023-07-25 05:00:18', '2025-04-26 12:01:32', NULL, NULL),
(1, 71, 'Cancelled', '2025-09-01 17:23:00', '2023-11-20 14:48:54', NULL, '2024-02-13 10:27:29'),
(42, 37, 'Completed', '2025-12-31 01:21:28', '2023-07-03 23:44:58', '2023-12-25 15:12:53', NULL),
(23, 5, 'Cancelled', NULL, '2025-03-24 18:02:10', NULL, '2024-08-15 01:21:50'),
(2, 39, 'Enrolled', '2026-01-17 19:05:23', '2023-08-08 12:11:54', NULL, NULL),
(64, 18, 'Completed', NULL, '2025-08-16 09:56:01', '2023-08-19 12:02:23', NULL),
(21, 94, 'Enrolled', NULL, '2024-06-10 06:46:45', NULL, NULL),
(44, 38, 'Enrolled', '2025-04-10 15:34:19', '2024-01-31 06:23:22', NULL, NULL),
(66, 42, 'Enrolled', '2025-09-04 11:46:55', '2023-07-15 06:43:39', NULL, NULL),
(32, 1, 'Enrolled', '2024-11-06 10:59:36', '2024-04-27 16:15:54', NULL, NULL),
(75, 93, 'Enrolled', '2024-04-28 02:15:42', '2024-06-19 23:47:59', NULL, NULL),
(86, 16, 'Enrolled', '2024-09-28 04:16:29', '2023-11-24 14:45:38', NULL, NULL),
(82, 38, 'Enrolled', '2025-09-06 05:34:38', '2024-03-28 07:58:41', NULL, NULL),
(59, 96, 'Cancelled', '2025-08-22 19:34:13', '2025-02-04 15:08:25', NULL, '2024-03-23 09:00:35'),
(88, 97, 'Enrolled', '2025-01-10 02:50:37', '2023-06-17 19:07:59', NULL, NULL),
(73, 15, 'Enrolled', '2026-01-04 05:27:21', '2026-01-26 18:24:15', NULL, NULL),
(22, 42, 'Completed', '2026-04-09 17:47:51', '2025-06-23 04:13:55', '2023-07-06 18:34:55', NULL),
(58, 8, 'Enrolled', '2023-04-29 20:20:42', '2025-11-17 15:07:30', NULL, NULL),
(60, 87, 'Completed', '2023-01-07 07:56:00', '2023-02-14 14:24:57', '2026-03-30 02:39:32', NULL),
(6, 55, 'Enrolled', '2023-05-22 17:11:15', '2023-05-11 19:42:11', NULL, NULL),
(5, 37, 'Enrolled', '2025-05-10 13:38:01', '2023-10-05 23:21:25', NULL, NULL),
(49, 58, 'Completed', NULL, '2025-02-12 13:40:36', '2026-01-09 04:50:31', NULL),
(84, 45, 'Enrolled', '2024-04-01 00:07:35', '2026-01-05 14:18:38', NULL, NULL),
(97, 3, 'Cancelled', '2025-02-15 08:21:42', '2025-08-06 19:49:21', NULL, '2024-05-21 16:46:15'),
(45, 20, 'Enrolled', '2025-05-08 22:23:19', '2023-08-20 01:10:22', NULL, NULL),
(99, 3, 'Enrolled', '2025-07-03 21:45:52', '2023-05-18 03:40:24', NULL, NULL),
(87, 91, 'Completed', '2024-04-24 19:39:07', '2024-05-16 01:36:38', '2024-03-20 02:03:18', NULL),
(18, 65, 'Cancelled', '2026-05-09 11:40:30', '2024-04-24 20:58:31', NULL, '2024-04-30 10:59:12'),
(19, 85, 'Enrolled', '2026-02-14 21:32:30', '2025-04-26 10:56:27', NULL, NULL),
(95, 23, 'Completed', '2024-12-06 23:25:20', '2025-05-24 20:14:16', '2025-02-19 19:05:42', NULL),
(41, 90, 'Enrolled', '2026-01-06 17:14:25', '2023-11-02 10:55:06', NULL, NULL),
(31, 29, 'Enrolled', '2026-02-25 15:01:30', '2023-10-23 16:51:29', NULL, NULL),
(54, 72, 'Enrolled', '2024-11-07 23:32:45', '2025-03-06 08:50:31', NULL, NULL),
(11, 58, 'Completed', '2024-01-26 01:52:35', '2023-07-09 19:30:06', '2024-07-03 13:43:56', NULL),
(87, 78, 'Completed', '2026-04-18 20:20:49', '2023-05-30 06:51:02', '2024-03-20 17:27:15', NULL),
(27, 43, 'Enrolled', '2023-08-29 17:26:13', '2023-02-01 07:42:42', NULL, NULL),
(32, 90, 'Completed', '2026-02-04 11:42:34', '2024-02-23 14:26:27', '2024-08-02 13:51:34', NULL),
(60, 69, 'Completed', '2025-10-15 16:58:00', '2024-09-23 09:31:23', '2023-07-21 17:05:37', NULL);

-- ---------- RATING (20) ----------
INSERT INTO rating (enrollment_id, rating, feedback) VALUES
(98, 2, 'Great course, learned a lot!'),
(41, 4, 'Very informative and well structured.'),
(27, 5, 'Could use more practical examples.'),
(48, 2, 'Excellent instructor and content.'),
(53, 4, 'Helped me understand the basics quickly.'),
(6, 5, 'A bit too fast paced for beginners.'),
(73, 3, 'Loved the hands-on projects.'),
(29, 3, 'Clear explanations throughout.'),
(95, 4, 'Would recommend to others.'),
(19, 4, 'Content felt outdated in places.'),
(3, 4, 'Perfect for my skill level.'),
(34, 2, 'Needs better video quality.'),
(71, 3, 'One of the best courses I''ve taken.'),
(75, 2, 'The pacing was just right.'),
(93, 2, 'Some sections felt rushed.'),
(54, 5, 'Very engaging and practical.'),
(38, 4, 'I gained real-world skills from this.'),
(20, 2, 'Instructor was very responsive.'),
(26, 5, 'Could improve the quizzes.'),
(43, 1, 'Solid course overall.');

-- ---------- ACTIVITY_LOG (20) ----------
INSERT INTO activity_log (user_id, action, target_type, target_id) VALUES
(68, 'Login', 'User', 10),
(86, 'Login', 'User', 98),
(1, 'Created course', 'Course', 18),
(81, 'Completed course', 'Course', 9),
(91, 'Enrolled in course', 'Course', 2),
(28, 'Viewed course', 'Course', 59),
(48, 'Login', 'User', 80),
(82, 'Password changed', 'User', 62),
(85, 'Cancelled enrollment', 'Enrollment', 3),
(1, 'Viewed course', 'Course', 71),
(53, 'Login', 'User', 3),
(68, 'Submitted rating', 'Rating', 69),
(37, 'Login', 'User', 65),
(90, 'Created course', 'Course', 23),
(14, 'Logout', 'User', 68),
(20, 'Completed course', 'Course', 25),
(80, 'Viewed course', 'Course', 33),
(46, 'Submitted rating', 'Rating', 51),
(11, 'Updated profile', 'User', 52),
(59, 'Password changed', 'User', 32);
-- migration_add_lessons_progress.sql
-- Run this ONCE in MySQL Workbench on your elearning database.
-- This adds a proper lesson table (multiple lessons per course) and
-- a lesson_progress table (tracks which lessons each student completed).
-- Your existing tables (course, enrollment, rating) are NOT changed.

USE elearning;

-- ── 1. Lesson table ─────────────────────────────────────────────────────────
-- One course can now have MULTIPLE lessons (videos/documents).
-- The existing course.videoURL stays for backward compatibility — it becomes
-- the "preview video" shown on the course detail page before enrolling.

CREATE TABLE IF NOT EXISTS lesson (
  lesson_id    INT PRIMARY KEY AUTO_INCREMENT,
  course_id    INT NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  videoURL     VARCHAR(255),           -- YouTube link or video URL
  duration     INT DEFAULT 0,          -- duration in minutes
  lesson_order INT DEFAULT 1,          -- display order inside the course
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- ── 2. Lesson progress table ─────────────────────────────────────────────────
-- Records which student completed which lesson, and when.
-- is_completed = 1 means student has finished watching that lesson.

CREATE TABLE IF NOT EXISTS lesson_progress (
  progress_id  INT PRIMARY KEY AUTO_INCREMENT,
  enrollment_id INT NOT NULL,          -- links to enrollment (student + course)
  lesson_id    INT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES enrollment(enrollment_id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (enrollment_id, lesson_id)  -- one record per student per lesson
);

-- ── 3. Sample data ───────────────────────────────────────────────────────────
-- Adds lessons to the 5 existing courses so the progress feature
-- has real data to show immediately after running this migration.

-- Course 1: Introduction to SQL Normalization (course_id = 1)
INSERT IGNORE INTO lesson (course_id, title, description, videoURL, duration, lesson_order) VALUES
(1, 'What is Normalization?', 'Introduction to database normalization concepts.', 'https://www.youtube.com/watch?v=GFQaEYEc8_8', 15, 1),
(1, 'First Normal Form (1NF)', 'Understanding atomic values and eliminating repeating groups.', 'https://www.youtube.com/watch?v=J-drts3N9kI', 20, 2),
(1, 'Second Normal Form (2NF)', 'Partial dependency removal in relational tables.', 'https://www.youtube.com/watch?v=J-drts3N9kI', 25, 3),
(1, 'Third Normal Form (3NF)', 'Transitive dependency and full normalization.', 'https://www.youtube.com/watch?v=J-drts3N9kI', 20, 4),
(1, 'Practice: Normalize a Real Schema', 'Hands-on normalization of a sample database.', 'https://www.youtube.com/watch?v=J-drts3N9kI', 30, 5);

-- Course 2: Advanced React Patterns (course_id = 2)
INSERT IGNORE INTO lesson (course_id, title, description, videoURL, duration, lesson_order) VALUES
(2, 'Custom Hooks Deep Dive', 'Build reusable logic with custom React hooks.', 'https://www.youtube.com/watch?v=6ThXsUwLWvc', 20, 1),
(2, 'Context API vs Redux', 'Choosing the right state management solution.', 'https://www.youtube.com/watch?v=6ThXsUwLWvc', 30, 2),
(2, 'Portals and Refs', 'Advanced rendering techniques with portals.', 'https://www.youtube.com/watch?v=6ThXsUwLWvc', 25, 3),
(2, 'Performance with useMemo', 'Optimizing renders with memoization.', 'https://www.youtube.com/watch?v=6ThXsUwLWvc', 20, 4);

-- Course 3: ESP32 & Microcontroller Baselines (course_id = 3)
INSERT IGNORE INTO lesson (course_id, title, description, videoURL, duration, lesson_order) VALUES
(3, 'ESP32 Setup & GPIO Basics', 'Installing toolchain and blinking your first LED.', 'https://www.youtube.com/watch?v=GfDZo3mV4_0', 25, 1),
(3, 'Serial Communication', 'UART, SPI, and I2C protocols explained.', 'https://www.youtube.com/watch?v=GfDZo3mV4_0', 30, 2),
(3, 'Servo Motor Control', 'Controlling servo motors with PWM signals.', 'https://www.youtube.com/watch?v=GfDZo3mV4_0', 35, 3);

-- Course 4: Fundamentals of UI/UX Prototyping (course_id = 4)
INSERT IGNORE INTO lesson (course_id, title, description, videoURL, duration, lesson_order) VALUES
(4, 'Typography Hierarchy', 'Choosing and pairing typefaces for UI.', 'https://www.youtube.com/watch?v=yNDgFK2Jj1E', 20, 1),
(4, 'Wireframing in Figma', 'Low-fidelity wireframing workflow.', 'https://www.youtube.com/watch?v=yNDgFK2Jj1E', 30, 2),
(4, 'Color Theory for UI', 'Accessible color palettes and contrast ratios.', 'https://www.youtube.com/watch?v=yNDgFK2Jj1E', 25, 3),
(4, 'High-Fidelity Prototypes', 'Interactive prototyping and handoff to developers.', 'https://www.youtube.com/watch?v=yNDgFK2Jj1E', 35, 4);

-- Course 5: Git Version Control for Teams (course_id = 5)
INSERT IGNORE INTO lesson (course_id, title, description, videoURL, duration, lesson_order) VALUES
(5, 'Git Fundamentals', 'Commits, branches, and the staging area.', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 20, 1),
(5, 'Branching Strategies', 'GitFlow vs trunk-based development.', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 25, 2),
(5, 'Resolving Merge Conflicts', 'Practical conflict resolution techniques.', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 30, 3),
(5, 'CI/CD Pipeline Integration', 'Connecting Git to automated deployment.', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 20, 4);

-- ── 4. Sample progress ───────────────────────────────────────────────────────
-- Adds realistic progress records for existing enrollments so the
-- "Student Learning Progress" section shows real data immediately.
-- enrollment_id 1 = user_id 1, course_id 2 (Completed)
-- enrollment_id 2 = user_id 2, course_id 3 (Enrolled)
-- enrollment_id 3 = user_id 4, course_id 4 (Enrolled)
-- enrollment_id 4 = user_id 6, course_id 1 (Completed)

-- Sophea (enrollment 1) completed all 4 lessons of React course
INSERT IGNORE INTO lesson_progress (enrollment_id, lesson_id, is_completed, completed_at) VALUES
(1, 6, TRUE, '2026-06-24 09:00:00'),
(1, 7, TRUE, '2026-06-24 10:00:00'),
(1, 8, TRUE, '2026-06-25 09:00:00'),
(1, 9, TRUE, '2026-06-26 10:00:00');

-- Rithy (enrollment 2) completed 1 of 3 ESP32 lessons
INSERT IGNORE INTO lesson_progress (enrollment_id, lesson_id, is_completed, completed_at) VALUES
(2, 11, TRUE, '2026-06-27 16:00:00'),
(2, 12, FALSE, NULL),
(2, 13, FALSE, NULL);

-- Bona (enrollment 3) completed 2 of 4 UI/UX lessons
INSERT IGNORE INTO lesson_progress (enrollment_id, lesson_id, is_completed, completed_at) VALUES
(3, 14, TRUE, '2026-06-27 20:00:00'),
(3, 15, TRUE, '2026-06-27 22:00:00'),
(3, 16, FALSE, NULL),
(3, 17, FALSE, NULL);

-- Chantra (enrollment 4) completed all 5 SQL lessons
INSERT IGNORE INTO lesson_progress (enrollment_id, lesson_id, is_completed, completed_at) VALUES
(4, 1, TRUE, '2026-06-23 10:00:00'),
(4, 2, TRUE, '2026-06-23 11:00:00'),
(4, 3, TRUE, '2026-06-24 10:00:00'),
(4, 4, TRUE, '2026-06-24 11:00:00'),
(4, 5, TRUE, '2026-06-25 10:00:00');