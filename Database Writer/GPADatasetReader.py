# function that matches the column of the CSV file to the corresponding GPA value
# column 7 = A+ = 4.0
# column 9 = A- = 3.67
# ... etc
def IndexToGpa(i):
    index_to_gpa = {
        7 : 4.0,
        8 : 4.0,
        9 : 3.67,
        10 : 3.33,
        11 : 3,
        12 : 2.67,
        13 : 2.33,
        14 : 2,
        15 : 1.67,
        16 : 1.33,
        17 : 1,
        18 : 0.67,
        19 : 0
    }
    return index_to_gpa.get(i, 0)

# instead of being able to split each line of the CSV on commas,
# we need to search for quotes that surround commas that are included in the data
# additionally, course explorer formats names as last_name, first_initial
# so we truncate names while we parse the CSV file
def ParseLine(line):
    open_quote = False
    rtr_list = []
    curr_str = ""
    
    # this weird iteration is used to truncate the name column of the CSV to fit the course explorer format
    stopping_index = min(line.rfind(",") + 3 , len(line))
    for index in range(0,stopping_index):
        char = line[index]
        if (char == "\""):
            open_quote = not open_quote
        else:
            if (open_quote):
                curr_str += char
            else:
                if (char == ","):
                    rtr_list.append(curr_str)
                    curr_str = ""
                else:
                    curr_str += char
    rtr_list.append(curr_str)
    return rtr_list

def ParseCSV(file_path):
    CSV_file = open(file_path, "r")

    CSV_str = CSV_file.read()
    split_on_new_line = CSV_str.split("\n")

    course_to_gpa_map = {}

    for line in split_on_new_line:
        split_on_comma = ParseLine(line)

        subject = split_on_comma[3]
        number = split_on_comma[4]
        class_title = subject + " " + number

        instructor = split_on_comma[21]

        total_students = 0
        gpa_sum = 0
        for i in range(7, 20):
            number_of_students = int(split_on_comma[i])
            total_students += number_of_students
            gpa_sum += number_of_students * IndexToGpa(i)
        gpa_sum = round(gpa_sum, 2)

        section_map = course_to_gpa_map.get(class_title, {})

        instructor_exists = len(instructor) != 0

        if (instructor_exists):
            instructor_list = section_map.get(instructor, [0, 0])
            instructor_list[0] += total_students
            instructor_list[1] += gpa_sum
            section_map[instructor] = instructor_list

        overall_list = section_map.get("Overall", [0, 0])
        overall_list[0] += total_students
        overall_list[1] += gpa_sum
        section_map["Overall"] = overall_list

        course_to_gpa_map[class_title] = section_map


    CSV_file.close()
    return course_to_gpa_map

def AddGPAData(course_list):
    course_to_gpa_map = ParseCSV("GPADataset.csv")
    for course in course_list:
        if course.title in course_to_gpa_map:
            gpa_map = course_to_gpa_map[course.title]
            gpa_tuple = gpa_map["Overall"]
            course.gpa = round(gpa_tuple[1] / gpa_tuple[0], 2)
            for section in course.section_list:
                if (section.instructor != "N/A" and section.instructor in gpa_map):
                    section_tuple = gpa_map[section.instructor]
                    section.gpa = round(section_tuple[1] / section_tuple[0], 2)

# example run down below:
# course_to_gpa_map = ParseCSV("GPADataset.csv")
# print(course_to_gpa_map["RHET 105"])



