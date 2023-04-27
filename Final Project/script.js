/* Updates the currentProfessorsList */
function injectHTMLCurrentProfessorsList(list) {
    console.log("Fired injectHTMLCurrentProfessorsList");
    const target = document.querySelector("#current_professors_list");
    target.innerHTML = "";
    list.forEach((item) => {
      const str = `<li class="wrappedListElement">${item}</li>`;
      target.innerHTML += str;
    });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
    return list.filter((item) => {
      const lowerCaseName = item.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });
}

/* Takes in the raw /get professors data and returns a list of 
the names of all professors */
function getListProfessorNames(professorListGeneral) {
  console.log("Entered - getListProfessorNames");

  let listProfessorNames = [];

  professorListGeneral.forEach((prof) => {
    listProfessorNames[listProfessorNames.length] = prof["name"];
  });
  return listProfessorNames;
}

function getListProfessorNamesLower(professorListGeneral) {
    console.log("Entered - getListProfessorNames");
  
    let listProfessorNames = [];
  
    professorListGeneral.forEach((prof) => {
      listProfessorNames[listProfessorNames.length] = prof["name"].toLowerCase();
    });
    return listProfessorNames;
  }

/* Returns an array containing the courses a specific Professor (professorName) has
   taught and correspsonding semesters ids */
function getSpecificProfessorCourses(professorName, professorsListGeneral) {
  console.log("Entered - getSpecificProfessorCourses");

  const lowerProfessorName = professorName.toLowerCase();
  let coursesTaught = [];

  professorsListGeneral.forEach((prof) => {
    lowerProfName = prof["name"].toLowerCase();

    if (lowerProfName.localeCompare(lowerProfessorName) == 0) {
      console.log(
        "Fired - lowerProfName .localCompare lowerProfessorName == 0"
      );

      const coursesTaughtRaw = JSON.stringify(prof["taught"]);

      coursesTaught = parseCoursesString(coursesTaughtRaw);
      /* console.table("value - coursesTaught = " + coursesTaught);
            console.table("type - coursesTaught = " + typeof(coursesTaught));
            console.table("semesters = " + coursesTaught[1]);*/
      return coursesTaught;
    } else {
      console.log(
        "Fired - lowerProfName .localCompare lowerProfessorName != 0 "
      );
    }
  });
  return coursesTaught;
  /* Should not get here */
  /* Means that the name entered is not present in the dataset */
  console.log(
    "John's Error - getSpecificProfessorCourses - Should not get here"
  );
}

function parseCoursesString(coursesTaughtRaw) {
  console.log("Entered - parseCourseString");

  let courseidList = [];
  let semesteridList = [];
  let curString = coursesTaughtRaw;

  while (curString.length > 3) {
    // the last part of the string would be left as '}]' (2)
    const firstQuote = curString.indexOf('"');
    //console.log("first quote pos = " + firstQuote);

    const secondQuote = curString.indexOf('"', firstQuote + 1);
    //console.log("second quote pos = " + secondQuote);

    const thirdQuote = curString.indexOf('"', secondQuote + 1);
    //console.log("third quote pos = " + thirdQuote);

    const fourthQuote = curString.indexOf('"', thirdQuote + 1);
    //console.log("fourth quote pos = " + fourthQuote);

    const fifthQuote = curString.indexOf('"', fourthQuote + 1);
    //console.log("fifth quote pos = " + fifthQuote);

    const sixthQuote = curString.indexOf('"', fifthQuote + 1);
    //console.log("sixth quote pos = " + sixthQuote);

    const seventhQuote = curString.indexOf('"', sixthQuote + 1);
    //console.log("seventh quote pos = " + seventhQuote);

    const eighthQuote = curString.indexOf('"', seventhQuote + 1);
    //console.log("eighth quote pos = " + eighthQuote);

    courseidList[courseidList.length] = curString.substring(
      thirdQuote + 1,
      fourthQuote
    );
    semesteridList[semesteridList.length] = curString.substring(
      seventhQuote + 1,
      eighthQuote
    );

    curString = curString.substring(eighthQuote + 1);
    //console.log("curString = " + curString);
  }
  return [courseidList, semesteridList];
}

/* Takes a numeric representation of semesterID (String) and returns a formatted String */
function formatSemesterID(semesteridList) {
  console.log("Entered - formatSemesterID");

  const spring = "Spring"; // 01
  const summer = "Summer"; // 05
  const fall = "Fall"; // 08

  let semesteridListFormatted = [];

  semesteridList.forEach((id) => {
    const year = id.substring(0, 4);
    const termNumeric = id.substring(4);

    if (termNumeric.localeCompare("01") == 0) {
      semesteridListFormatted[semesteridListFormatted.length] = spring.concat(
        " ",
        year
      );
    } else if (termNumeric.localeCompare("05") == 0) {
      semesteridListFormatted[semesteridListFormatted.length] = summer.concat(
        " ",
        year
      );
    } else if (termNumeric.localeCompare("08") == 0) {
      semesteridListFormatted[semesteridListFormatted.length] = fall.concat(
        " ",
        year
      );
    } else {
      console.log(
        "Error - the forEach loop in formatSemesterID - termNumeric should be 01, 05, or 08 - Seeing this means termNumeric was not one of the previous values"
      );
    }
    // console.log("example - year = " + year + " -- termNumeric = " + termNumeric);
  });
  return semesteridListFormatted;
}

function countCoursesPerSemester(semesteridListFormatted) {
  console.log("Entered - countCoursesPerSemester");

  let dataPointsUnformatted = [];

  semesteridListFormatted.forEach((id) => {
    if (dataPointsUnformatted.some((temp) => temp.term === id)) {
      const index = dataPointsUnformatted.findIndex((obj) => obj.term === id);
      const oldCount = dataPointsUnformatted[index].count;
      dataPointsUnformatted[index].count = oldCount + 1;
    } else {
      dataPointsUnformatted[dataPointsUnformatted.length] = {
        term: id,
        count: 1,
      };
    }
  });
  return dataPointsUnformatted;
}

function convertToDataPointsProfessorCourses(rawData) {
  console.log("Entered - convertToDataPoints");
  let dataPoints = [];

  rawData.forEach((pair) => {
    dataPoints[dataPoints.length] = {
      y: pair.count,
      label: pair.term,
    };
  });
  return dataPoints;
}

function convertToDataPointsProfessorDepartments(rawData) {
    console.log("Entered - convertToDataPoints");
    let dataPoints = [];
  
    rawData.forEach((pair) => {
      dataPoints[dataPoints.length] = {
        y: pair.count,
        label: pair.department,
      };
    });
    return dataPoints;
  }

function trimCourseNumber(courseidList) {
    console.log("Entered - trimCourseNumber");

    let courseidListTrimmed = [];

    courseidList.forEach((course) => {
        courseidListTrimmed[courseidListTrimmed.length] = course.substring(0, 4);
    })
    return courseidListTrimmed;
}

function countDepartments(courseidListTrimmed) {
    console.log("Entered - countDepartments");

    let dataPointsUnformatted = []

    courseidListTrimmed.forEach((courseid) => {
        if (dataPointsUnformatted.some((temp) => temp.department === courseid)) {
            const index = dataPointsUnformatted.findIndex((obj) => obj.department === courseid);
            const oldCount = dataPointsUnformatted[index].count;
            dataPointsUnformatted[index].count = oldCount + 1;
        } else {
            dataPointsUnformatted[dataPointsUnformatted.length] = {
                department: courseid,
                count: 1,
            };
        }
           
    });
    return dataPointsUnformatted;
}

function displayProfessorDepartmentChart(professorName, professorListGeneral, chart) {
    console.log("Entered - displayProfessorDepartmentChart");
    console.log("Clearing chart data");
    clearChart(chart);

    const taughtSeparated = getSpecificProfessorCourses(professorName, professorListGeneral);
    const courseidListRaw = taughtSeparated[0];
    const courseidListTrimmed = trimCourseNumber(courseidListRaw);
    const departmentsRaw = countDepartments(courseidListTrimmed);
    const departmentsDataPoints = convertToDataPointsProfessorDepartments(departmentsRaw);
    
    chart.options.data[0].type = "pie";
    chart.options.data[0].indexLabel = "{label}: #percent%";
    chart.options.data[0].dataPoints = departmentsDataPoints;
    chart.title.set(
      "text",
      "Pie Chart For The Departments of Courses Taught By: ".concat(professorName)
    );
    chart.render();

    console.log("lll");
    console.log(departmentsDataPoints);

}

function displayProfessorCoursesChart(professorName, professorsListGeneral, chart) {
  console.log("Entered - displayProfessorCoursesChart");
  console.log("Clearing chart data");
  clearChart(chart);

  const taughtSeparated = getSpecificProfessorCourses(professorName, professorsListGeneral);
  console.table(taughtSeparated);

  const courseidList = taughtSeparated[0];
  const semesteridList = taughtSeparated[1];

  const semesteridListFormatted = formatSemesterID(semesteridList);

  const coursesPerSemester = countCoursesPerSemester(semesteridListFormatted);
  const coursesPerSemesterDataPoints = convertToDataPointsProfessorCourses(coursesPerSemester);

    console.table(coursesPerSemesterDataPoints);
    console.table(chart.options.data[0].dataPoints);

  chart.options.data[0].type = "line";
  chart.options.data[0].dataPoints = coursesPerSemesterDataPoints;
  chart.title.set(
    "text",
    "Line Chart For Courses Taught By: ".concat(professorName)
  );
  chart.options.axisY.title = "Number Of Courses Taught";
  chart.render();
}

function clearChart(chart) {
    chart.options.data[0].dataPoints = [];
    chart.options.data[0].indexLabel = null;
}




/* The list for when no image is displayed */
function getProfessorsListCut(professorsListGeneral, displaySectionBox) {
    console.log("Entered - getProfessorsListCut");
    console.log(displaySectionBox.classList);

    const allProfessorNames = getListProfessorNames(professorsListGeneral);
    let cutList = [];

    if (displaySectionBox.classList.contains("hidden")) {
        cutList = allProfessorNames.slice(0, 20);
    } else {
        cutList = allProfessorNames.slice(0, 10);
    }

    console.log("cut list = " + cutList);
    return cutList;
}

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");

  const initializeDataButton = document.querySelector("#initialize_data_button");
  const clearLocalStorageButton = document.querySelector("#clear_local_storage_button");

  const courseCreateImageButton = document.querySelector("#course_create_image_button");
  const departmentCreateImageButton = document.querySelector("#department_create_image_button");
  const professorCreateImageButton = document.querySelector("#professor_create_image_button");

  const headerCourseButton = document.querySelector("#h_course");
  const headerDepartmentButton = document.querySelector("#h_department");
  const headerProfessorButton = document.querySelector("#h_professor");

  const headerCourseButtonCurrent = document.querySelector("#h_course_current");
  const headerDepartmentButtonCurrent = document.querySelector("#h_department_current");
  const headerProfessorButtonCurrent = document.querySelector("#h_professor_current");

  const filterCourseSection = document.querySelector("#filter_course_box");
  const filterDepartmentSection = document.querySelector("#filter_department_box");
  const filterProfessorSection = document.querySelector("#filter_professor_box");
  const filterDepartmentProfessorSubsection = document.querySelector("#filter_department_professor_box");

  const courseDepartmentCheckbox = document.querySelector("#course_department_checkbox");
  const courseProfessorCheckbox = document.querySelector("#course_professor_checkbox");

  const departmentCourseCheckbox = document.querySelector("#department_course_checkbox");
  const departmentProfessorCheckbox = document.querySelector("#department_professor_checkbox");
  const departmentProfessorSemestersCheckbox = document.querySelector("#department_professor_semesters_checkbox");
  const departmentProfessorNumberCheckbox = document.querySelector("#department_professor_number_checkbox");

  const professorCoursesCheckbox = document.querySelector("#professor_courses_checkbox");
  const professorDepartmentCheckbox = document.querySelector("#professor_department_checkbox");

  const courseNameTextfield = document.querySelector("#course_name_textfield");
  const departmentNameTextfield = document.querySelector("#department_name_textfield");
  const professorNameTextfield = document.querySelector("#professor_name_textfield");

  const displaySectionBox = document.querySelector("#display_section_box");
  const initialBoxDataUnloaded = document.querySelector("#initial_box_data_unloaded");
  const initialBoxDataLoaded = document.querySelector("#initial_box_data_loaded");

  const professorsListLabel = document.querySelector("#professors_list_label");
  
  const currentProfessorsList = document.querySelector("#current_professors_list");

  const professorFilterHelpContainer = document.querySelector("#professor_filter_help_container");

  const professorFilterHelpText = document.querySelector("#professor_filter_help_text");
  const professorFilterHelpCheckboxes = document.querySelector("#professor_filter_help_checkboxes"); 


  var chart;
  let emptyArray = [];
  let semestersListGeneral = [];
  let storedProfessorsList = []; // The list which is cut and displayed 
  let professorsListGeneral = []; // The overall Json list

  const tempProfessorsListGeneral = localStorage.getItem('professorsListGeneral');
  let parsedTemp = JSON.parse(tempProfessorsListGeneral);

  if (parsedTemp?.length > 0) {
    console.log("Loaded - professorsListGeneral was loaded from localStorage");
    professorsListGeneral = parsedTemp;
    initialBoxDataUnloaded.classList.add("hidden");
    initialBoxDataLoaded.classList.remove("hidden");
  } else {
    clearLocalStorageButton.classList.add("hidden");
    initialBoxDataLoaded.classList.add("hidden");
  }

  /* Makes the chart in the background on page load */
  window.onload = function () {
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Simple Line Chart",
      },
      axisY: {
        title: "Y-Axis Title",
        interlacedColor: "#F8F1E4",
        ticklength: 10,
      },
      data: [
        {
          type: "line",
          dataPoints: [],
        },
      ],
    });
    chart.render();
  };

  function clearProfessorTab() {
    console.log("Entered - clearProfessorTab");

    filterProfessorSection.classList.add("hidden");
    headerProfessorButtonCurrent.classList.add("hidden");
    currentProfessorsList.classList.add("hidden");
    professorsListLabel.classList.add("hidden");
    headerProfessorButton.classList.remove("hidden");
    professorCoursesCheckbox.checked = false;
    professorDepartmentCheckbox.checked = false;
    professorNameTextfield.value = "";
    displaySectionBox.classList.add("hidden");
  }

  function clearDepartmentTab() {
    console.log("Entered - clearDepartmentTab");

    filterDepartmentSection.classList.add("hidden");
    headerDepartmentButtonCurrent.classList.add("hidden");
    headerDepartmentButton.classList.remove("hidden");
    departmentCourseCheckbox.checked = false;
    departmentProfessorCheckbox.checked = false;
    filterDepartmentProfessorSubsection.classList.add("hidden");
    departmentProfessorSemestersCheckbox.checked = false;
    departmentProfessorNumberCheckbox.checked = false;
    departmentNameTextfield.value = "";
    displaySectionBox.classList.add("hidden");
  }

  function clearCourseTab() {
    console.log("Entered - clearCourseTab");

    filterCourseSection.classList.add("hidden");
    headerCourseButtonCurrent.classList.add("hidden");
    headerCourseButton.classList.remove("hidden");
    courseDepartmentCheckbox.checked = false;
    courseProfessorCheckbox.checked = false;
    courseNameTextfield.value = "";
    displaySectionBox.classList.add("hidden");
  }

  /* Initialize the main_form to allow for event listeners */
  initializeDataButton.addEventListener("click", async (submitEvent) => {
    console.log("Fired - initialize button");

    /* Loading list of professors */
    console.log("Fired - loading professor - a list of all professors");
    const professorsListRaw = await fetch("https://api.umd.io/v1/professors");
    professorsListGeneral = await professorsListRaw.json();
    localStorage.setItem('professorsListGeneral', JSON.stringify(professorsListGeneral));


    /* Loading list of semesters */
    console.log("Fired - loading semesters - a list of all semesters");
    const semestersListRaw = await fetch(
      "https://api.umd.io/v1/courses/semesters"
    );
    semestersListGeneral = await semestersListRaw.json();

    /* Loading list of courses */
    /*
        console.log("Fired - loading courses - a list of all courses");
        const courseListRaw = await fetch (
            "https://api.umd.io/v1/"
        )*/

    /*
        const generalFormRaw = await fetch ("https://api.umd.io/v1", {
        });
        console.log("got generalFormRaw data: ");
       
        console.log("getting generalForm data: ");
        console.table(generalFormRaw);

        const generalForm = await generalFormRaw.json();
        console.log("got generalForm data: ");
        console.table(generalForm);

        console.log("generalForm index 0 data: ");
        console.table(generalForm[1]);
*/
        initializeDataButton.classList.add("hidden");
        initialBoxDataUnloaded.classList.add("hidden");
        initialBoxDataLoaded.classList.remove("hidden");
        clearLocalStorageButton.classList.remove("hidden");
  });

  /* Primary Logic Flow */
  /* The Real Main Event */

  courseCreateImageButton.addEventListener("click", (event) => {
    console.log("Fired - Clicked course_refresh button");

    /* Fill in later */
  });

  departmentCreateImageButton.addEventListener("click", (event) => {
    console.log("Fired - Clicked department_refresh button");

    /* Fill in later */
  });

  professorCreateImageButton.addEventListener("click", (event) => {
    console.log("Fired - Clicked professor_refresh button");
    
    const professorName = professorNameTextfield.value;
    const allProfessorNames = getListProfessorNamesLower(professorsListGeneral);

    if (allProfessorNames?.includes(professorName)) {

      if (professorCoursesCheckbox.checked) {
        console.log("Stepped into - professor_courses_checkbox is checked");

        displaySectionBox.classList.remove("hidden");
        currentProfessorsList.classList.remove("box");
        currentProfessorsList.classList.add("currentListWrapped");
        displayProfessorCoursesChart(professorName, professorsListGeneral, chart);
      } else if (professorDepartmentCheckbox.checked) {
        console.log("Stepped into - professor_department_checkbox is checked");

        displaySectionBox.classList.remove("hidden");
        currentProfessorsList.classList.remove("box");
        currentProfessorsList.classList.add("currentListWrapped");
        displayProfessorDepartmentChart(professorName,professorsListGeneral,chart);
      } else {
        console.log("No Step - no filter boxes are checked");

        professorFilterHelpContainer.classList.remove("hidden");
        professorFilterHelpCheckboxes.classList.add("hugeTopMargin");
        professorFilterHelpCheckboxes.classList.remove("hidden");

        setTimeout(()=> { professorFilterHelpCheckboxes.classList.remove("hugeTopMargin"); }, 3000);
        setTimeout(()=> { professorFilterHelpCheckboxes.classList.add("hidden"); }, 3000);
        setTimeout(()=> { professorFilterHelpContainer.classList.add("hidden"); }, 3000);
      }
    } else {
        professorFilterHelpContainer.classList.remove("hidden");
        professorFilterHelpText.classList.remove("hidden");

        setTimeout(()=> { professorFilterHelpText.classList.add("hidden"); }, 3000);
        setTimeout(()=> { professorFilterHelpContainer.classList.add("hidden"); }, 3000);

        if (professorCoursesCheckbox.checked != true && professorDepartmentCheckbox.checked != true) {
            professorFilterHelpCheckboxes.classList.add("bigTopMargin");
            professorFilterHelpCheckboxes.classList.remove("hidden");

            setTimeout(()=> { professorFilterHelpCheckboxes.classList.remove("bigTopMargin"); }, 3000);
            setTimeout(()=> { professorFilterHelpCheckboxes.classList.add("hidden"); }, 3000);
        }
    }
  });

/* Textfield Event Listeners */
professorNameTextfield.addEventListener("input", (event) => {
    console.log("Input - professorNameTextfield - " + event.target.value);

    const allNames = getListProfessorNames(professorsListGeneral);
    const newList = filterList(allNames, event.target.value);
    let trimmedList = [];
    trimmedList = newList.slice(0,20);
    injectHTMLCurrentProfessorsList(trimmedList);
});

  /* Checkbox Event Listeners - Professor Tab */
  professorCoursesCheckbox.addEventListener("change", (event) => {
    if (professorCoursesCheckbox.checked) {
      console.log("Fired - professor_courses_checkbox is now selected");

      if (professorDepartmentCheckbox.checked) {
        professorDepartmentCheckbox.checked = false;
      }
    } else {
      console.log("Fired - professor_courses_checkbox is no longer selected");
    }
  });

  professorDepartmentCheckbox.addEventListener("change", (event) => {
    if (professorDepartmentCheckbox.checked) {
      console.log("Fired - professor_department_checkbox is now selected");

      if (professorCoursesCheckbox.checked) {
        professorCoursesCheckbox.checked = false;
      }
    } else {
      console.log(
        "Fired - professor_department_checkbox is no longer selected"
      );
    }
  });

  /* Checkbox Event Listeners - Department Tab */
  departmentCourseCheckbox.addEventListener("change", (event) => {
    if (departmentCourseCheckbox.checked) {
      console.log("Fired - department_course_checkbox is now selected");

      if (departmentProfessorCheckbox.checked) {
        departmentProfessorCheckbox.checked = false;
        filterDepartmentProfessorSubsection.classList.add("hidden");

        /* Clearing department_professor sub-checkboxes */
        if (departmentProfessorSemestersCheckbox.checked) {
          departmentProfessorSemestersCheckbox.checked = false;
        }
        if (departmentProfessorNumberCheckbox.checked) {
          departmentProfessorNumberCheckbox.checked = false;
        }
      }
    } else {
      console.log("Fired - department_course_checkbox is no longer selected");
    }
  });

  departmentProfessorCheckbox.addEventListener("change", (event) => {
    if (departmentProfessorCheckbox.checked) {
      console.log("Fired - department_professor_checkbox is now selected");
      filterDepartmentProfessorSubsection.classList.remove("hidden");

      if (departmentCourseCheckbox.checked) {
        departmentCourseCheckbox.checked = false;
      }
    } else {
      console.log(
        "Fired - department_professor_checkbox is no longer selected"
      );

      /* Clearing the subsection boxes */
      if (departmentProfessorSemestersCheckbox.checked) {
        departmentProfessorSemestersCheckbox.checked = false;
      }
      if (departmentProfessorNumberCheckbox.checked) {
        departmentProfessorNumberCheckbox.checked = false;
      }
      filterDepartmentProfessorSubsection.classList.add("hidden");
    }
  });

  departmentProfessorSemestersCheckbox.addEventListener("change", (event) => {
    if (departmentProfessorSemestersCheckbox.checked) {
      console.log(
        "Fired - department_professor_semesters_checkbox is now selected"
      );

      if (departmentProfessorNumberCheckbox.checked) {
        departmentProfessorNumberCheckbox.checked = false;
      }
    } else {
      console.log(
        "Fired - department_professor_semesters_checkbox is no longer selected"
      );
    }
  });

  departmentProfessorNumberCheckbox.addEventListener("change", (event) => {
    if (departmentProfessorNumberCheckbox.checked) {
      console.log(
        "Fired - department_professor_number_checkbox is now selected"
      );
      if (departmentProfessorSemestersCheckbox.checked) {
        departmentProfessorSemestersCheckbox.checked = false;
      }
    } else {
      console.log(
        "Fired - department_professor_number_checkbox is no longer selected"
      );
    }
  });

  /* Checkbox Event Listeners - Course Tab */
  courseDepartmentCheckbox.addEventListener("change", (event) => {
    if (courseDepartmentCheckbox.checked) {
      console.log("Fired - course_department_checkbox is now selected");

      /* Doesn't allow for two filters of the same scope to be applied at once */
      if (courseProfessorCheckbox.checked) {
        courseProfessorCheckbox.checked = false;
      }
    } else {
      console.log("Fired - course_department_checkbox is no longer selected");
    }
    /* Insert future code here */
  });

  courseProfessorCheckbox.addEventListener("change", (event) => {
    if (courseProfessorCheckbox.checked) {
      console.log("Fired - course_professor_checkbox is now selected");

      /* Doesn't allow for two filters of the same scope to be applied at once */
      if (courseDepartmentCheckbox.checked) {
        courseDepartmentCheckbox.checked = false;
      }
    } else {
      console.log("Fired - course_professor_checkbox is no longer selected");
    }
    /* Insert future code here */
  });

  /* Header Button Event Listeners */

  /* Set view to search by course */
  headerCourseButton.addEventListener("click", (event) => {
    console.log("Fired - Clicked h_course button");

    /* this makes the user load the data before allowing any input */
    if (professorsListGeneral.length > 0) {
        headerCourseButton.classList.add("hidden");
        headerCourseButtonCurrent.classList.remove("hidden");

        initialBoxDataLoaded.classList.add("hidden");
       // courseListLabel.classList.remove("hidden");
       // currentCoursesList.classList.remove("hidden");
       // storedCoursesList = get 
       // injectHTML
      if (filterDepartmentSection.classList.contains("hidden") != true) {
        clearDepartmentTab();
      }
      if (filterProfessorSection.classList.contains("hidden") != true) {
        clearProfessorTab();
      }
      if (filterCourseSection.classList.contains("hidden")) {
        filterCourseSection.classList.remove("hidden");
      }
    }
  });

  headerCourseButtonCurrent.addEventListener("click", (event) => {
    console.log("Fired - headerCourseButtonCurrent");

    clearCourseTab();
    initialBoxDataLoaded.classList.remove("hidden");
  })

  /* Set view to search by department */
  headerDepartmentButton.addEventListener("click", (event) => {
    console.log("Fired - Clicked h_department button");

    /* this makes the user load the data before allowing any input */
    if (professorsListGeneral.length > 0) {
        headerDepartmentButton.classList.add("hidden");
        headerDepartmentButtonCurrent.classList.remove("hidden");

        initialBoxDataLoaded.classList.add("hidden");
        //departmentListLabel.classList.remove("hidden");
        //currentDepartmentsList.classList.remove("hidden");
        /*storedDepartmentsList = getDepartmentsListCut()*/
        /* inject html */
        if (filterProfessorSection.classList.contains("hidden") != true) {
            clearProfessorTab();    
        }
        if (filterCourseSection.classList.contains("hidden") != true) {
            clearCourseTab();
        }
        if (filterDepartmentSection.classList.contains("hidden")) {
            filterDepartmentSection.classList.remove("hidden");
        } 
    }
  });
  
  headerDepartmentButtonCurrent.addEventListener("click", (event) => {
    console.log("Fired - headerDepartmentButtonCurrent");

    clearDepartmentTab();
    initialBoxDataLoaded.classList.remove("hidden");
  })

  /* Set view to search by professor */
  headerProfessorButton.addEventListener("click", (event) => {
    console.log("Fired - Clicked headerProfessorButton button");

    /* This runs if professorsListGeneral is populated and the section has not been selected yet */    
        if (professorsListGeneral.length > 0) {
            headerProfessorButton.classList.add("hidden");
            headerProfessorButtonCurrent.classList.remove("hidden");

            initialBoxDataLoaded.classList.add("hidden");
            professorsListLabel.classList.remove("hidden");
            currentProfessorsList.classList.remove("hidden");
            storedProfessorsList = getProfessorsListCut(professorsListGeneral, displaySectionBox);
            injectHTMLCurrentProfessorsList(storedProfessorsList);
        if (filterCourseSection.classList.contains("hidden") != true) {
            clearCourseTab();
        }
        if (filterDepartmentSection.classList.contains("hidden") != true) {
          clearDepartmentTab();
        }
        if (filterProfessorSection.classList.contains("hidden")) {
          filterProfessorSection.classList.remove("hidden");
        } 
        /*if (chart.options.data[0].dataPoints.length > 0) {
            displaySectionBox.classList.remove("hidden");
            currentProfessorsList.classList.remove("box");
            currentProfessorsList.classList.add("currentListWrapped");
        }*/
    }  
  });

  headerProfessorButtonCurrent.addEventListener("click", (event) => {
    console.log("Fired - headerProfessorButtonCurrent");

    clearProfessorTab();
    initialBoxDataLoaded.classList.remove("hidden");
  })

  clearLocalStorageButton.addEventListener("click", (event) => {
    console.log("Fired - clearLocalStorageButton");

    localStorage.clear();
    console.log('localStorage Check', localStorage.getItem("professorsListGeneral"));

    initialBoxDataLoaded.classList.add("hidden");
    initialBoxDataUnloaded.classList.remove("hidden");
    clearLocalStorageButton.classList.add("hidden");
    initializeDataButton.classList.remove("hidden");
  })
}
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
