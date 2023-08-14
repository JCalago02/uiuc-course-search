import requests
import json
from bs4 import BeautifulSoup
from SectionInfo import SectionInfo
from CourseListing import CourseListing
from GPADatasetReader import AddGPAData 
# function to be exported that retrieves the gen eds along with all of the necessary information
def ScrapeAllGenEds():
    print("func called")
    # the following is how we would scrape all of the pages that we need to find:
    names_dict = dict()
    courses_list = []

    gen_ed_link_list = ["https://courses.illinois.edu/gened/2023/fall/ACP",
    "https://courses.illinois.edu/gened/2023/fall/CS",
    "https://courses.illinois.edu/gened/2023/fall/HUM",
    "https://courses.illinois.edu/gened/2023/fall/NAT",
    "https://courses.illinois.edu/gened/2023/fall/QR",
    "https://courses.illinois.edu/gened/2023/fall/SBS"]

    for link in gen_ed_link_list:
        result_tuple = ScrapeClasses(names_dict, link)
        names_dict.update(result_tuple[0])
        courses_list += result_tuple[1]

    # adds all GPAs
    AddGPAData(courses_list)

    return courses_list

# below function returns a tuple
# parameters: dictionary containg all previously scraped courses titles' and the link to be scraped
# return value 0: an updated dictionary containing all of the titles of the scraped classes from the page
# return value 1: a list of all of the courses scraped from the input href
def ScrapeClasses(names_dict, href):
    courses_list = []
    page = requests.get(href)
    soup = BeautifulSoup(page.content, "html.parser")
    table = soup.tbody
    course_list_html = table.find_all('tr')
    category_to_id = {"US": 1,
                      "WCC": 2,
                      "NW": 3,
                      "HP": 4,
                      "LA": 5,
                      "BSC": 6,
                      "SS": 7,
                      "PS": 8,
                      "LS": 9,
                      "ACP": 10,
                      "QR1": 11,
                      "QR2": 12}
    for course in course_list_html:
        col_list = course.find_all('td')
        # find name
        name = col_list[2].get_text().strip()
        
        class_offered = len(col_list[1].contents) == 5
        class_unique = names_dict.get(name, True)

        if class_offered and class_unique:
            # find categories
            categories = []
            for col in range(3, 10):
                col_str = col_list[col].get_text().strip()
                if len(col_str) != 0:
                    categories.append(category_to_id[col_str])
            # find initial link
            link = "https://courses.illinois.edu" + col_list[1].a.get('href')
            # scrape initial link for main link + title
            main_link_and_title = FindMainLinkAndTitle(link)
            # scrape section information
            section_list = ScrapeSectionInfos(main_link_and_title["link"])
            # create class object + update data structures
            new_class = CourseListing(name, main_link_and_title["title"], categories, main_link_and_title["link"], section_list)
            courses_list.append(new_class)
            names_dict[name] = False
    return names_dict, courses_list
# below function returns a dictionary
# scrapes the section page to make sure the chosen course title is the main title
# that shows up in the GPA CSV (needed bc some courses are listed under more than 1 department)
def FindMainLinkAndTitle(href):
    page = requests.get(href)
    soup = BeautifulSoup(page.content, "html.parser")
    description_area = soup.find_all("div", class_="col-sm-12")[3].contents
    description = description_area[5]
    description_text = description.get_text()

    is_duplicate_page = description_text[0:7] == "Same as"

    relevant_link = href
    if (is_duplicate_page):
        is_sub_page = description_text.find("See") != -1
        if (is_sub_page):
            link_list = description.find_all("a")
            relevant_link = "https://courses.illinois.edu/" + link_list[len(link_list) - 1].get("href")

    
    split_link_on_slash = relevant_link.split("/")
    title_num = split_link_on_slash[len(split_link_on_slash) - 1]
    title_name = split_link_on_slash[len(split_link_on_slash) - 2]
    full_title = title_name + " " + title_num
    return {"link" : relevant_link, "title" : full_title} 
 
# below function returns a list of section objects corresponding to one course
# input parameter: href to the page containing all section info for a given course
def ScrapeSectionInfos(href):
    page = requests.get(href)
    soup = BeautifulSoup(page.content, "html.parser")
    item = soup.find_all('script')

    section_info_list = []

    
    class_list = item[4].string.strip().split("status\"") # html of every section of the given class
    # because of script tag, need to scrape this part manually
    
    for idx in range(1, len(class_list)):
        course_soup = class_list[idx]
        scraped_time = ScrapeSectionTime(course_soup)
        section_start = -1.0
        section_end = -1.0
        if (scraped_time[16] == "M"):
            section_start = TimeStringToDeci(scraped_time[0:7]) 
            section_end = TimeStringToDeci(scraped_time[10:17])
        section_day = ScrapeSectionDay(course_soup)
        section_type = ScrapeSectionType(course_soup)
        section_instructor = ScrapeSectionInstructor(course_soup)

        new_section = SectionInfo(section_start, section_end, section_day, section_type, section_instructor)
        section_info_list.append(new_section)

    return section_info_list
    
        


def ScrapeSectionTime(course_soup):
    time_idx = course_soup.find("time")
    left_adj = 67
    right_adj = 84
    time_str = course_soup[time_idx + left_adj : time_idx + right_adj]
    return time_str

def ScrapeSectionDay(course_soup):
    day_idx = course_soup.find("day")
    left_adj = 33
    curr_idx = day_idx + left_adj
    day_str = ""
    while(CharIsDayOfTheWeek(course_soup[curr_idx])):
        day_str += course_soup[curr_idx]
        curr_idx += 1
    if (len(day_str) == 0):
        return "TBD"
    return day_str

def ScrapeSectionType(course_soup):
    type_idx = course_soup.find("type")
    left_adj = 34
    curr_idx = type_idx + left_adj
    type_str = ""
    while(course_soup[curr_idx] != '<'):
        char_ = course_soup[curr_idx]
        if (char_ != "\\"):
            type_str += course_soup[curr_idx]
        else:
            type_str += ' '
        curr_idx += 1
        

    return type_str.strip()

def ScrapeSectionInstructor(course_soup):
    instructor_idx = course_soup.find("instructor")
    left_adj = 40
    curr_idx = instructor_idx + left_adj
    instructor_str = ""
    while(course_soup[curr_idx] != '<'):
        instructor_str += course_soup[curr_idx]
        curr_idx += 1
    if (len(instructor_str) == 0):
        instructor_str = "N/A"
    return instructor_str

# unused function that would've been called in the "ScrapeSectionInfos function"
"""
def ScrapeSectionLocation(course_soup):
    location_idx = course_soup.find("location")
    left_adj = 38
    curr_idx = location_idx + left_adj
    location_str = ""
    while(course_soup[curr_idx] != '<'):
        location_str += course_soup[curr_idx]
        curr_idx += 1
    return location_str.strip()
"""

def CharIsDayOfTheWeek(inp):
    return (inp == 'M' or 
            inp == 'T' or
            inp == 'W' or
            inp == 'R' or
            inp == 'F')

def TimeStringToDeci(time_str):
    hour = int(time_str[0:2])
    decimal = int(time_str[3:5]) / 100
    if (time_str[5:7] == "PM" and hour != 12):
        hour += 12
    return hour + decimal





"""
print(len(courses_list))

test_course = courses_list[0]
test_course.PrintInfo()
test_course.PrintSections()
"""

"""
irregular course links that are examples of edge cases that need to be handled when scraping sections

course_link = "https://courses.illinois.edu/schedule/2023/fall/BTW/250" # regular listing
course_link_2 = "https://courses.illinois.edu/schedule/2023/fall/BTW/280" # no start/end time
course_link_3 = "https://courses.illinois.edu/schedule/2023/fall/MATH/241" # no instructor

list_1 = ScrapeSectionInfos(course_link)
list_2 = ScrapeSectionInfos(course_link_2)
list_3 = ScrapeSectionInfos(course_link_3)

for section in list_2:
    section.PrintInfo()
"""






"""
database structure:

class database:
    class_id (int)
    class_title (string)
    class_name (string)
    class_gpa (double)
    class_link (string)

classtosection:
    class_id (references class database)
    section_instructor (string)
    section_gpa (double)
    section_type (string)
    section_start (double)
    section_end (double)
    section_days (string)

category:
    1 - minority
    2 - wester
    3 - non_western
    4 - hist_philo_persp
    5 - lit_and_arts
    6 - behav_sci
    7 - soc_sci
    8 - phys_sci
    9 - life_sci
    10 - adv_comp
    11 - quant_1
    12 - quant_2

    
classtocategory
    class_id (references class database)
    category_id (referenes category database)
"""