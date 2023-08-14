const express = require("express");
const router = express.Router();
const db = require("../database"); // imported file that contains database credentials

router.get('/testdb', async (req, res) => {
    const min_gpa = req.body.min_gpa;
    const query = `
        SELECT class_title
        FROM geneddatabase.class as C
        WHERE C.class_gpa > ${min_gpa}
    `;
    let result_arr = [];
    
    try {
        result_arr = await db.query(query);
        res.status(200).send({
            result_list : result_arr
        })
    } catch (err) {
        console.log(err);
        res.status(418).send({
            message : `Something wrong happened please try again`
        })
    }
    
    
})
// -------------------------------------------------------------------------
function generateClassIdQuery(categoryIdList) {
    const placeholder_id = categoryIdList.map(() => '?').join(', ');
    const classIdQuery = `SELECT DISTINCT C.class_id
                          FROM geneddatabase.classtocategory as C
                          WHERE C.category_id IN (${placeholder_id})
                          GROUP BY C.class_id
                          HAVING COUNT(DISTINCT category_id) = ?;`
    return classIdQuery;
}

// recursive function to generate all permutations of the items within the timeslot daylist
// this function removes the first character of the input list, then recursively calls itself
// base case is when the list contains only one day, where it then adds an empty character and returns the list
// it then recurses back up, with each step taking the permutation list, duplicating it, and combining the halves
// with one half including the first character while the other isn't
function generateDayPermutations(inputList) {
    // base case
    if (inputList.length == 1) {
        const return_list = inputList;
        return_list.push('');
        return return_list;
    }
    // recursive step
    const subarray = inputList.slice(1, inputList.length);
    const firstChar = inputList[0];
    const subPermutationList = generateDayPermutations(subarray);
    const subPermutationListCopy = subPermutationList;

    subPermutationListCopy.forEach(element => subPermutationList.push(firstChar + element));
    return subPermutationList;
}

function generateTimeslotPlaceholder(timeSlots) {
    if (timeSlots.length === 0) {
        return "TRUE";
    }
    const timeSlotQuery = timeSlots.map((timeSlot) => (`S.section_start >= ? AND S.section_end <= ? AND S.section_days in (${generateDayPermutations(timeSlot.dayList).filter(day => day !== "").map(item => `'${item}'`)})`)).join("OR ");

    if (!timeSlots.includeOnline) {
        const onlineQuery = ` AND S.section_type NOT IN ('Online', 'Online Discussion', 'Online Lecture', 'Online Lecture Discussion')`;
        return timeSlotQuery + onlineQuery;
    }
    return timeSlotQuery;
}

function generateSectionQuery(classIdList, timeSlots) {
    const placeholder_timeslot = generateTimeslotPlaceholder(timeSlots);
    const sectionQuery = `SELECT * FROM
                            (SELECT * FROM geneddatabase.classtosection as S
                            WHERE S.class_id IN (${classIdList})
                            AND S.section_gpa >= ? AND S.section_gpa <= ?
                            AND (${placeholder_timeslot})) as I
                          INNER JOIN geneddatabase.class
                          ON class.class_id = I.class_id;`
    return sectionQuery;
}

function GenerateCategoryList(inputList) {
    const kRemoveIndices = [10, 7, 4];
    kRemoveIndices.forEach(index => inputList.splice(index, 1));
    inputList[0] = false;
    return inputList.map((category, index) => (category ? index : null)).filter((id) => id !== null);
}

router.get('/:parameterObject', async (req, res) => {
    // retrieving all of the necessary values from the parameter object submitted via http request
    const parameterJson = req.params.parameterObject;
    const restrictionsObject = JSON.parse(parameterJson);

    const categoryList = restrictionsObject.requirementCategories;
    const minGPA = restrictionsObject.minGPA;
    const maxGPA = restrictionsObject.maxGPA;
    const timeSlots = restrictionsObject.timeSlots;
    
    // executes the SQL query and stores the resultant classIds into classIdList
    try {
        // the following line turns the fixed length list of booleans into a list of indicies that the database recognizes
        let parameterList = GenerateCategoryList(categoryList);
        const classIdQuery = generateClassIdQuery(parameterList);
        parameterList.push(parameterList.length);

        // initial query to obtain the list of all relevant class_ids based on category
        let queryResult = await db.query(classIdQuery, parameterList);
        classIdList = queryResult[0].map(item => item.class_id);

        // preprocessing to create a query to obtain all relevant sections based on the rest of the parameter JSON
        const sectionQuery = generateSectionQuery(classIdList, timeSlots);
        parameterList = (timeSlots.length == 0) ? [minGPA, maxGPA] : timeSlots.flatMap(timeSlot => [minGPA, maxGPA, timeSlot.startTime, timeSlot.endTime]);

        // secondary query for all relevant sections based on parameter JSON and merging section and class tables
        queryResult = await db.query(sectionQuery, parameterList);
        const sectionList = queryResult[0];

        // sets the response JSON to the retrieved joined table
        res.json({sectionList});
    } catch (err) {
        console.log(err);
        res.status(418).send({
            message : `Something wrong happened please try again`
        })
    }
});


const testClassInfo = {
    title: "HIST 141",
    name: "Western Worlds: Ancient and Medieval Socities from the Mediterranean to Northern Europe",
    instructor: "Symes, C",
    categoryList: ["CS - Western", "Hum - Hist & Phil"],
    instGPA: 3.4,
    allGPA: 3.6,
    section: "Lecture",
    time: "11:00AM - 11:50AM",
    days: ['T', 'R'],
    link: "https://courses.illinois.edu/schedule/2023/fall/HIST/141"
}

module.exports = router;