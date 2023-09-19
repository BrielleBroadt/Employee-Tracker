INSERT INTO department (name)
VALUES ('Operations'),
    ('Clinical'),
    ('BusinessDevelopment');
INSERT INTO role (title, salary, department_id)
VALUES ('Tech', 40000, 1),
    ('Therapist', 60000, 2),
    ('Admissions', 80000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Meredith", "Grey", 1, 1),
    ("Mark", "Sloan", 2, 1),
    ("Alex", "Karev", 3, 1),
    ("Christina", "Yang", 2, NULL),
    ("Arazona", "Robbins", 3, NULL),
    ("Richard", "Webber", 1, NULL);