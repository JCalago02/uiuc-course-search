class CourseListing():
    def __init__(self, name, title, categories, link, section_list):
        self.name = name
        self.title = title
        self.categories = categories
        self.link = link
        self.section_list = section_list
        self.gpa = -1.0

    def PrintInfo(self):
        print(f"{self.title} -> {self.name}. Fufills {self.categories} | {self.gpa}")
        print(f"Link: {self.link} \n")
    
    def PrintSections(self):
        for section in self.section_list:
            section.PrintInfo()