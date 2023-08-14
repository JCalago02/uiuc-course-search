import mysql.connector
from datetime import datetime
from CourseExplorerScraper import ScrapeAllGenEds
from GPADatasetReader import ParseCSV

db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="password",
    database="geneddatabase"
    )
mycursor = db.cursor()

course_list = ScrapeAllGenEds()

for course in course_list:
    class_query = "INSERT INTO class (class_title, class_name, class_gpa, class_link) VALUES (%s, %s, %s, %s)"
    class_value_tuple = (course.title, course.name, course.gpa, course.link)
    mycursor.execute(class_query, class_value_tuple)

    class_id = mycursor.lastrowid

    section_query = "INSERT INTO classtosection (class_id, section_instructor, section_gpa, section_type, section_start, section_end, section_days) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    for section in course.section_list:
        section_value_tuple = (class_id, section.instructor, section.gpa, section.type_, section.start, section.end, section.day)
        mycursor.execute(section_query, section_value_tuple)

    
    category_query = "INSERT INTO classtocategory (class_id, category_id) VALUES (%s, %s)"
    for category in course.categories:
        category_value_tuple = (class_id, category)
        mycursor.execute(category_query, category_value_tuple)


db.commit()
