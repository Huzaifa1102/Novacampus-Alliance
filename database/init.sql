-- ============================================================
-- NOVACAMPUS ALLIANCE — DATABASE SCHEMA
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search later


-- ============================================================
-- CAMPUSES
-- ============================================================
CREATE TABLE campuses (
    campus_id       VARCHAR(10)  PRIMARY KEY,
    campus_name     VARCHAR(100) NOT NULL,
    city            VARCHAR(50)  NOT NULL,
    capacity        INT          NOT NULL,
    created_at      TIMESTAMP    DEFAULT NOW()
);

INSERT INTO campuses VALUES
    ('CAMP001', 'Paris Center',          'Paris',     1200, NOW()),
    ('CAMP002', 'Lyon Confluence',       'Lyon',       800, NOW()),
    ('CAMP003', 'Toulouse Aerospace',    'Toulouse',   600, NOW()),
    ('CAMP004', 'Marseille Mediterranean','Marseille',  500, NOW());


-- ============================================================
-- PROGRAMS
-- ============================================================
CREATE TABLE programs (
    program_id      VARCHAR(10)   PRIMARY KEY,
    program_name    VARCHAR(100)  NOT NULL,
    campus_id       VARCHAR(10)   REFERENCES campuses(campus_id),
    duration_years  INT           NOT NULL,
    tuition_fee     DECIMAL(10,2) NOT NULL,
    domain          VARCHAR(50)   NOT NULL,
    created_at      TIMESTAMP     DEFAULT NOW()
);

INSERT INTO programs VALUES
    ('PROG001', 'Bachelor Business Administration', 'CAMP001', 3, 8500.00,  'Business',     NOW()),
    ('PROG002', 'Bachelor Computer Science',        'CAMP001', 3, 9500.00,  'Technology',   NOW()),
    ('PROG003', 'Master Data Science',              'CAMP001', 2, 12000.00, 'Technology',   NOW()),
    ('PROG004', 'Bachelor Mechanical Engineering',  'CAMP002', 3, 9000.00,  'Engineering',  NOW()),
    ('PROG005', 'Bachelor Hospitality Management',  'CAMP002', 3, 7500.00,  'Hospitality',  NOW()),
    ('PROG006', 'Master Aerospace Engineering',     'CAMP003', 2, 13000.00, 'Engineering',  NOW()),
    ('PROG007', 'Bachelor International Business',  'CAMP004', 3, 8000.00,  'Business',     NOW());


-- ============================================================
-- INSTRUCTORS
-- ============================================================
CREATE TABLE instructors (
    instructor_id   VARCHAR(10)  PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    specialty       VARCHAR(100),
    campus_id       VARCHAR(10)  REFERENCES campuses(campus_id),
    created_at      TIMESTAMP    DEFAULT NOW()
);

INSERT INTO instructors VALUES
    ('INS001', 'Marie',    'Dubois',   'marie.dubois@novacampus.fr',   'Computer Science',    'CAMP001', NOW()),
    ('INS002', 'Jean',     'Mercier',  'jean.mercier@novacampus.fr',   'Business',            'CAMP001', NOW()),
    ('INS003', 'Thomas',   'Bernard',  'thomas.bernard@novacampus.fr', 'Economics',           'CAMP001', NOW()),
    ('INS004', 'Sophie',   'Laurent',  'sophie.laurent@novacampus.fr', 'Data Science',        'CAMP001', NOW()),
    ('INS005', 'Pierre',   'Martin',   'pierre.martin@novacampus.fr',  'Mechanical Eng.',     'CAMP002', NOW()),
    ('INS006', 'Claire',   'Petit',    'claire.petit@novacampus.fr',   'Hospitality',         'CAMP002', NOW()),
    ('INS007', 'Nicolas',  'Robert',   'nicolas.robert@novacampus.fr', 'Aerospace Eng.',      'CAMP003', NOW()),
    ('INS008', 'Isabelle', 'Moreau',   'isabelle.moreau@novacampus.fr','International Bus.',  'CAMP004', NOW());


-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE students (
    student_id      VARCHAR(10)  PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth   DATE,
    campus_id       VARCHAR(10)  REFERENCES campuses(campus_id),
    program_id      VARCHAR(10)  REFERENCES programs(program_id),
    enrollment_date DATE         NOT NULL,
    status          VARCHAR(20)  DEFAULT 'Active'
                                 CHECK (status IN ('Active','Inactive','Graduated','Suspended')),
    created_at      TIMESTAMP    DEFAULT NOW()
);

INSERT INTO students VALUES
    ('STU001', 'Alice',   'Dubois',   'alice.dubois@etu.novacampus.fr',   '2002-03-15', 'CAMP001', 'PROG002', '2023-09-01', 'Active',   NOW()),
    ('STU002', 'Clara',   'Martin',   'clara.martin@etu.novacampus.fr',   '2001-07-22', 'CAMP001', 'PROG002', '2023-09-01', 'Active',   NOW()),
    ('STU003', 'Elise',   'Bernard',  'elise.bernard@etu.novacampus.fr',  '2002-11-08', 'CAMP001', 'PROG001', '2023-09-01', 'Active',   NOW()),
    ('STU004', 'Maxime',  'Leroy',    'maxime.leroy@etu.novacampus.fr',   '2001-05-30', 'CAMP001', 'PROG001', '2023-09-01', 'Active',   NOW()),
    ('STU005', 'Lucas',   'Moreau',   'lucas.moreau@etu.novacampus.fr',   '2003-01-14', 'CAMP002', 'PROG004', '2023-09-01', 'Active',   NOW()),
    ('STU006', 'Emma',    'Petit',    'emma.petit@etu.novacampus.fr',     '2002-09-03', 'CAMP002', 'PROG005', '2023-09-01', 'Active',   NOW()),
    ('STU007', 'Hugo',    'Simon',    'hugo.simon@etu.novacampus.fr',     '2001-12-19', 'CAMP001', 'PROG002', '2023-09-01', 'Active',   NOW()),
    ('STU008', 'Camille', 'Dupont',   'camille.dupont@etu.novacampus.fr', '2002-06-25', 'CAMP003', 'PROG006', '2023-09-01', 'Active',   NOW()),
    ('STU009', 'Lea',     'Girard',   'lea.girard@etu.novacampus.fr',     '2003-04-11', 'CAMP004', 'PROG007', '2023-09-01', 'Active',   NOW()),
    ('STU010', 'Nathan',  'Roux',     'nathan.roux@etu.novacampus.fr',    '2001-08-07', 'CAMP001', 'PROG003', '2023-09-01', 'Active',   NOW()),
    ('STU011', 'Anais',   'Garcia',   'anais.garcia@etu.novacampus.fr',   '2002-02-28', 'CAMP001', 'PROG002', '2023-09-01', 'Active',   NOW()),
    ('STU012', 'Antoine', 'Fournier', 'antoine.fournier@etu.novacampus.fr','2001-10-16','CAMP002', 'PROG004', '2023-09-01', 'Active',   NOW());


-- ============================================================
-- ROOMS
-- ============================================================
CREATE TABLE rooms (
    room_id         VARCHAR(10)  PRIMARY KEY,
    room_name       VARCHAR(100) NOT NULL,
    campus_id       VARCHAR(10)  REFERENCES campuses(campus_id),
    room_type       VARCHAR(50)  NOT NULL
                                 CHECK (room_type IN ('Computer Lab','Lecture Hall','Seminar Room','Workshop')),
    capacity        INT          NOT NULL,
    equipment       TEXT,
    created_at      TIMESTAMP    DEFAULT NOW()
);

INSERT INTO rooms VALUES
    ('ROOM301', 'Amphi A',       'CAMP001', 'Lecture Hall',  120, 'Projector, Microphone, AC',            NOW()),
    ('ROOM302', 'Python Lab 1',  'CAMP001', 'Computer Lab',   35, '35 PCs, Projector, AC',               NOW()),
    ('ROOM303', 'AI Lab',        'CAMP001', 'Computer Lab',   30, '30 PCs with GPUs, Servers, AC',       NOW()),
    ('ROOM304', 'Web Dev Lab',   'CAMP001', 'Computer Lab',   32, '32 PCs, Projector, AC',               NOW()),
    ('ROOM305', 'Seminar S1',    'CAMP001', 'Seminar Room',   25, 'Whiteboard, Projector',               NOW()),
    ('ROOM401', 'Amphi B',       'CAMP002', 'Lecture Hall',  100, 'Projector, Microphone, AC',            NOW()),
    ('ROOM402', 'Mech Workshop', 'CAMP002', 'Workshop',       40, 'CNC Machine, 3D Printer, Tools',      NOW()),
    ('ROOM501', 'Aerospace Lab', 'CAMP003', 'Workshop',       35, 'Wind Tunnel Simulator, CAD Stations', NOW()),
    ('ROOM601', 'Business Room', 'CAMP004', 'Seminar Room',   30, 'Whiteboard, Video Conf System',       NOW());


-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE courses (
    course_id       VARCHAR(10)  PRIMARY KEY,
    course_name     VARCHAR(100) NOT NULL,
    campus_id       VARCHAR(10)  REFERENCES campuses(campus_id),
    program_id      VARCHAR(10)  REFERENCES programs(program_id),
    instructor_id   VARCHAR(10)  REFERENCES instructors(instructor_id),
    credits         INT          NOT NULL,
    semester        VARCHAR(5)   NOT NULL CHECK (semester IN ('S1','S2')),
    academic_year   VARCHAR(9)   NOT NULL,
    created_at      TIMESTAMP    DEFAULT NOW()
);

INSERT INTO courses VALUES
    ('INFO101', 'Python Programming',    'CAMP001', 'PROG002', 'INS001', 4, 'S1', '2023-2024', NOW()),
    ('INFO201', 'Web Development',       'CAMP001', 'PROG002', 'INS001', 4, 'S1', '2023-2024', NOW()),
    ('INFO301', 'Machine Learning',      'CAMP001', 'PROG003', 'INS004', 5, 'S1', '2023-2024', NOW()),
    ('COM101',  'Intro to Business',     'CAMP001', 'PROG001', 'INS002', 3, 'S1', '2023-2024', NOW()),
    ('ECO101',  'International Econ.',   'CAMP001', 'PROG001', 'INS003', 3, 'S1', '2023-2024', NOW()),
    ('MECH101', 'Mechanics Fundamentals','CAMP002', 'PROG004', 'INS005', 4, 'S1', '2023-2024', NOW()),
    ('HOSP101', 'Hospitality Mgmt',      'CAMP002', 'PROG005', 'INS006', 3, 'S1', '2023-2024', NOW()),
    ('AERO101', 'Aerodynamics',          'CAMP003', 'PROG006', 'INS007', 5, 'S1', '2023-2024', NOW()),
    ('BUS101',  'Global Business',       'CAMP004', 'PROG007', 'INS008', 3, 'S1', '2023-2024', NOW());


-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE TABLE enrollments (
    enrollment_id   UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id      VARCHAR(10)  REFERENCES students(student_id),
    course_id       VARCHAR(10)  REFERENCES courses(course_id),
    campus_id       VARCHAR(10)  REFERENCES campuses(campus_id),
    enrollment_date DATE         NOT NULL,
    grade           DECIMAL(4,2) CHECK (grade >= 0 AND grade <= 20),
    attendance_rate DECIMAL(5,2) CHECK (attendance_rate >= 0 AND attendance_rate <= 100),
    status          VARCHAR(20)  DEFAULT 'Active'
                                 CHECK (status IN ('Active','Completed','Dropped','Failed')),
    published       BOOLEAN      DEFAULT FALSE,
    created_at      TIMESTAMP    DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

INSERT INTO enrollments (student_id, course_id, campus_id, enrollment_date, grade, attendance_rate, status, published) VALUES
    ('STU001', 'INFO101', 'CAMP001', '2023-09-01', NULL,  95.0, 'Active', FALSE),
    ('STU001', 'INFO201', 'CAMP001', '2023-09-01', NULL,  92.0, 'Active', FALSE),
    ('STU002', 'INFO101', 'CAMP001', '2023-09-01', 14.5,  92.0, 'Active', TRUE),
    ('STU003', 'COM101',  'CAMP001', '2023-09-01', NULL,  88.0, 'Active', FALSE),
    ('STU003', 'ECO101',  'CAMP001', '2023-09-01', NULL,  91.0, 'Active', FALSE),
    ('STU004', 'COM101',  'CAMP001', '2023-09-01', NULL,  85.0, 'Active', FALSE),
    ('STU007', 'INFO101', 'CAMP001', '2023-09-01', NULL,  79.0, 'Active', FALSE),
    ('STU010', 'INFO301', 'CAMP001', '2023-09-01', NULL,  93.0, 'Active', FALSE),
    ('STU011', 'INFO101', 'CAMP001', '2023-09-01', NULL,  85.0, 'Active', FALSE),
    ('STU005', 'MECH101', 'CAMP002', '2023-09-01', NULL,  90.0, 'Active', FALSE),
    ('STU006', 'HOSP101', 'CAMP002', '2023-09-01', NULL,  87.0, 'Active', FALSE),
    ('STU008', 'AERO101', 'CAMP003', '2023-09-01', NULL,  94.0, 'Active', FALSE),
    ('STU009', 'BUS101',  'CAMP004', '2023-09-01', NULL,  89.0, 'Active', FALSE),
    ('STU012', 'MECH101', 'CAMP002', '2023-09-01', NULL,  82.0, 'Active', FALSE);


-- ============================================================
-- SCHEDULES
-- ============================================================
CREATE TABLE schedules (
    schedule_id     UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id       VARCHAR(10)  REFERENCES courses(course_id),
    room_id         VARCHAR(10)  REFERENCES rooms(room_id),
    campus_id       VARCHAR(10)  REFERENCES campuses(campus_id),
    instructor_id   VARCHAR(10)  REFERENCES instructors(instructor_id),
    day_of_week     VARCHAR(10)  NOT NULL
                                 CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday')),
    start_time      TIME         NOT NULL,
    end_time        TIME         NOT NULL,
    semester        VARCHAR(5)   NOT NULL CHECK (semester IN ('S1','S2')),
    academic_year   VARCHAR(9)   NOT NULL,
    created_at      TIMESTAMP    DEFAULT NOW(),
    -- Prevent room double-booking at exact same time slot
    UNIQUE (room_id, day_of_week, start_time, semester, academic_year)
);

INSERT INTO schedules (course_id, room_id, campus_id, instructor_id, day_of_week, start_time, end_time, semester, academic_year) VALUES
    ('INFO101', 'ROOM302', 'CAMP001', 'INS001', 'Monday',    '09:00', '12:00', 'S1', '2023-2024'),
    ('INFO101', 'ROOM302', 'CAMP001', 'INS001', 'Wednesday', '14:00', '17:00', 'S1', '2023-2024'),
    ('INFO201', 'ROOM304', 'CAMP001', 'INS001', 'Tuesday',   '09:00', '12:00', 'S1', '2023-2024'),
    ('INFO301', 'ROOM303', 'CAMP001', 'INS004', 'Friday',    '09:00', '12:00', 'S1', '2023-2024'),
    ('COM101',  'ROOM305', 'CAMP001', 'INS002', 'Monday',    '14:00', '17:00', 'S1', '2023-2024'),
    ('ECO101',  'ROOM301', 'CAMP001', 'INS003', 'Thursday',  '09:00', '12:00', 'S1', '2023-2024'),
    ('MECH101', 'ROOM402', 'CAMP002', 'INS005', 'Tuesday',   '09:00', '12:00', 'S1', '2023-2024'),
    ('HOSP101', 'ROOM401', 'CAMP002', 'INS006', 'Wednesday', '14:00', '17:00', 'S1', '2023-2024'),
    ('AERO101', 'ROOM501', 'CAMP003', 'INS007', 'Thursday',  '14:00', '17:00', 'S1', '2023-2024'),
    ('BUS101',  'ROOM601', 'CAMP004', 'INS008', 'Friday',    '14:00', '17:00', 'S1', '2023-2024');


-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
    payment_id      UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id      VARCHAR(10)   REFERENCES students(student_id),
    campus_id       VARCHAR(10)   REFERENCES campuses(campus_id),
    amount          DECIMAL(10,2) NOT NULL,
    due_date        DATE          NOT NULL,
    payment_date    DATE,
    status          VARCHAR(20)   DEFAULT 'Pending'
                                  CHECK (status IN ('Paid','Pending','Delay','Exempted')),
    reminder_level  INT           DEFAULT 0 CHECK (reminder_level BETWEEN 0 AND 4),
    academic_year   VARCHAR(9)    NOT NULL,
    created_at      TIMESTAMP     DEFAULT NOW()
);

INSERT INTO payments (student_id, campus_id, amount, due_date, payment_date, status, reminder_level, academic_year) VALUES
    ('STU001', 'CAMP001', 9500.00, '2023-10-01', '2023-09-28', 'Paid',    0, '2023-2024'),
    ('STU002', 'CAMP001', 9500.00, '2023-10-01', '2023-10-01', 'Paid',    0, '2023-2024'),
    ('STU003', 'CAMP001', 8500.00, '2023-10-01', '2023-10-15', 'Paid',    0, '2023-2024'),
    ('STU004', 'CAMP001', 8500.00, '2023-10-01',  NULL,        'Delay',   2, '2023-2024'),
    ('STU005', 'CAMP002', 9000.00, '2023-10-01', '2023-09-30', 'Paid',    0, '2023-2024'),
    ('STU006', 'CAMP002', 7500.00, '2023-10-01', '2023-10-05', 'Paid',    0, '2023-2024'),
    ('STU007', 'CAMP001', 9500.00, '2023-10-01',  NULL,        'Delay',   1, '2023-2024'),
    ('STU008', 'CAMP003', 13000.00,'2023-10-01', '2023-10-01', 'Paid',    0, '2023-2024'),
    ('STU009', 'CAMP004', 8000.00, '2023-10-01',  NULL,        'Pending', 0, '2023-2024'),
    ('STU010', 'CAMP001', 12000.00,'2023-10-01', '2023-09-25', 'Paid',    0, '2023-2024'),
    ('STU011', 'CAMP001', 9500.00, '2023-10-01', '2023-10-02', 'Paid',    0, '2023-2024'),
    ('STU012', 'CAMP002', 9000.00, '2023-10-01',  NULL,        'Delay',   1, '2023-2024');


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all campus-scoped tables
ALTER TABLE students    ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- Campus isolation: users only see their own campus data
CREATE POLICY campus_isolation ON students
    USING (campus_id = current_setting('app.current_campus_id', true));

CREATE POLICY campus_isolation ON courses
    USING (campus_id = current_setting('app.current_campus_id', true));

CREATE POLICY campus_isolation ON enrollments
    USING (campus_id = current_setting('app.current_campus_id', true));

CREATE POLICY campus_isolation ON payments
    USING (campus_id = current_setting('app.current_campus_id', true));

CREATE POLICY campus_isolation ON rooms
    USING (campus_id = current_setting('app.current_campus_id', true));

CREATE POLICY campus_isolation ON schedules
    USING (campus_id = current_setting('app.current_campus_id', true));

CREATE POLICY campus_isolation ON instructors
    USING (campus_id = current_setting('app.current_campus_id', true));

-- Management role bypasses all isolation (sees all campuses)
CREATE POLICY management_bypass ON students    TO novacampus USING (true);
CREATE POLICY management_bypass ON courses     TO novacampus USING (true);
CREATE POLICY management_bypass ON enrollments TO novacampus USING (true);
CREATE POLICY management_bypass ON payments    TO novacampus USING (true);
CREATE POLICY management_bypass ON rooms       TO novacampus USING (true);
CREATE POLICY management_bypass ON schedules   TO novacampus USING (true);
CREATE POLICY management_bypass ON instructors TO novacampus USING (true);


-- ============================================================
-- MATERIALIZED VIEWS (for Reporting Service)
-- ============================================================
CREATE MATERIALIZED VIEW kpi_per_campus AS
    SELECT
        c.campus_id,
        c.campus_name,
        COUNT(DISTINCT s.student_id)                                      AS total_students,
        ROUND(AVG(e.attendance_rate), 2)                                  AS avg_attendance,
        ROUND(
            SUM(p.amount) FILTER (WHERE p.status = 'Paid') /
            NULLIF(SUM(p.amount), 0) * 100
        , 2)                                                               AS payment_collection_rate,
        COUNT(DISTINCT e.enrollment_id) FILTER (WHERE e.status = 'Completed'
            AND e.grade >= 10) * 100.0 /
            NULLIF(COUNT(DISTINCT e.enrollment_id), 0)                    AS success_rate
    FROM campuses c
    LEFT JOIN students    s ON s.campus_id = c.campus_id
    LEFT JOIN enrollments e ON e.student_id = s.student_id
    LEFT JOIN payments    p ON p.student_id = s.student_id
    GROUP BY c.campus_id, c.campus_name
WITH DATA;

CREATE UNIQUE INDEX ON kpi_per_campus (campus_id);