-- Fill department table
INSERT INTO department (name)
VALUES ("Publishing Department"),("Janitorial Department");

-- Fill role table
INSERT INTO role (title,department_id)
VALUES ("Writer",1),("Editor",1),("Translator",1),("Janitor",2);

-- Fill employee table
INSERT INTO employee (first_name,last_name,role_id)
VALUES ("Daniel","Frezzo",1),("Asley","Hudson",2),("Baa","Humbug",3),("Jessica","Zendaya",4),("Hasting","Moreno",4);