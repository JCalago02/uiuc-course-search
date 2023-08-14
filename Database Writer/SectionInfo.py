class SectionInfo():
    def __init__(self, start, end, day, type_, instructor):
        self.start = start
        self.end = end
        self.day = day
        self.type_ = type_
        self.instructor = instructor
        self.gpa = -1.0

    def PrintInfo(self):
        print(f"{self.instructor} -> {self.type_}: {self.day} - {self.start}-{self.end} | {self.gpa}")