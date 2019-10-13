/*I have developed a simple Todo App by which we can create n number of lists and inside each list 
  we can create n number of tasks. This app has following functionality:
  1. Create a list with a given name and if no name provided a list will be created with name 'Unknown List'
  2. Delete the created list.
  3. Create, Edit and delete a task inside the list */


//I  have used IIFE(Immediately Invoked Function Expression) which consists all my app code and returns 
//only one function addList as a public method. I have created this to avoid global namespace collision  
var todoApp = function () {

	//An object to store all the created lists and tasks inside the lists
	var todoList = {};

	//Id generator
	var idList = 1;

	//List constructor to create new Lists which contains a id, list name and a list of tasks which is an object.
	var List = function (id, listName){
		
		this.taskList = {};
		this.name = listName;
		this.id = id;

	};

	//Task constructor to create new Tasks which contains a id and description of tasks.
	var Task = function (id, taskDes){
		this.id = id;
		this.description = taskDes;

	};

	//Function to add the entered list name to the list object and calls the createList function to create the list element
	function addList() {
		var listInput = document.getElementById('listName'),
		    listName = listInput.value,
		 	list;

		if (!(listName)){
			listName = 'Unknown List';
		}

		list = new List (idList, listName);
		todoList[list.id] = list;
		createList(list);

		idList++;
		listInput.value = '';
		idTask = 1;
		listInput.focus();

	}

	//Create a list container with the following elements which will display in the frontend
	//1. list container with its title on the top
	//2. task container which will contain all the tasks of the particular list
	//3. add task button which will open the hidden add task area and delete list button to delete the list
	//4. hidden add task area which will open when add task button is clicked it will contain a text area, 
	//   add button to add task to the list and close to hide the add task area
	function createList(list){
		var todoListArea, listContainer, listTitle, taskContainer, spanContainer, deleteListButton, addTaskButton,
			addTaskContainer, taskTextArea, 
			spanButton, addButton, closeButton,
			listId = list.id;
		
		todoListArea = document.getElementById('todoList-area');

		//List Container
		listContainer = document.createElement('div');
		listContainer.setAttribute('class', 'list');
		listContainer.setAttribute('id', listId);

		//List Title Name
		listTitle = document.createElement('div');
		listTitle.setAttribute('class', 'list-title');
		listTitle.innerHTML = list.name;
		listContainer.appendChild(listTitle);

		//Task Contaniner
		taskContainer = document.createElement('div');
		taskContainer.setAttribute('class', 'task-lists');
		taskContainer.setAttribute('id', 'tasks_'+listId);
		listContainer.appendChild(taskContainer);

		//Buttons for Adding tasks and deleting the list container
		spanContainer = document.createElement('span');
		spanContainer.setAttribute('class', 'dispalyBlock');
		spanContainer.setAttribute('id', 'buttons_'+listId);
		listContainer.appendChild(spanContainer);

		//Delete Button for deleting the list by calling the function delete list
		deleteListButton = document.createElement('button');
		deleteListButton.setAttribute('class', 'floatRight');
		deleteListButton.textContent = 'Delete List';
		deleteListButton.addEventListener('click', deleteList);
		deleteListButton.listId = listId;
		spanContainer.appendChild(deleteListButton);

		//Add Task button for creating new task div
		addTaskButton = document.createElement('button');
		addTaskButton.setAttribute('class', 'floatRight');
		addTaskButton.textContent = 'Add Task';
		addTaskButton.addEventListener('click', showAddTaskDiv);
		addTaskButton.listId = listId;
		spanContainer.appendChild(addTaskButton);

		//Container for adding new task
		addTaskContainer = document.createElement('div');
		addTaskContainer.setAttribute('id', 'addTaskElement_'+listId);
		addTaskContainer.setAttribute('class', 'add-task-container hide');
		listContainer.appendChild(addTaskContainer);

		//text area to get the description of the task
		taskTextArea = document.createElement('textarea');
		taskTextArea.setAttribute('class', 'task-textarea');
		taskTextArea.setAttribute('id', 'addTask_'+listId);
		addTaskContainer.appendChild(taskTextArea);

		//buttons for adding task description to the list and hiding add task container
		spanButton = document.createElement('span');
		spanButton.setAttribute('class', 'tableRow floatRight');
		addTaskContainer.appendChild(spanButton);

		//Add button to add task to the list with the entered description
		addButton = document.createElement('button');
		addButton.setAttribute('class', 'tableCell');
		addButton.setAttribute('id', 'newTask_'+listId);
		addButton.textContent = 'Add';
		addButton.listId = listId;
		addButton.addEventListener('click', addTask);
		addButton.addEventListener('click', hideAfterAddTaskDiv);
		spanButton.appendChild(addButton);

		//Close button to hide the task container
		closeButton = document.createElement('button');
		closeButton.setAttribute('class', 'tableCell');
		closeButton.textContent = 'Close';
		closeButton.addEventListener('click', hideAddTaskDiv);
		closeButton.listId = listId;
		spanButton.appendChild(closeButton);

		todoListArea.appendChild(listContainer);
	}

	//Function to delete the list by selecting the listID from created event 
	function deleteList(event){

		var selectedList = event.target,
			listId = selectedList.listId,
			list = todoList[listId];

		if(list) {
			delete todoList[listId];
			removeElement(listId);
		}

	}

	//Function to show the add task container and hide the list buttons (add task and delete)
	function showAddTaskDiv(event){

		var selectedListId = event.target.listId,
			elementToShow = document.getElementById('addTaskElement_' + selectedListId),
			elementToHide = document.getElementById('buttons_' + selectedListId);

		showElement(elementToShow);
		hideElement(elementToHide);
	}

	// Function to hide the task text area after adding the task and show the list buttons (add task and delete)
	function hideAfterAddTaskDiv(event){
		
		var selectedListId = event.target.id.split('_')[1],
			elementToHide = document.getElementById('addTaskElement_' + selectedListId),
			elementToShow = document.getElementById('buttons_' + selectedListId);

		showElement(elementToShow);
		hideElement(elementToHide);
	}

	//Function to hide the add task container and show the list buttons (add task and delete)
	function hideAddTaskDiv(event){

		var selectedListId = event.target.listId,
			elementToHide = document.getElementById('addTaskElement_' + selectedListId),
			elementToShow = document.getElementById('buttons_' + selectedListId);

		hideElement(elementToHide);
		showElement(elementToShow);
	}

	//Function to add task to the selected list, and create the task element using createTask function
	function addTask(event){
		var currentListId = event.target.listId,
			currentTask = document.getElementById('addTask_'+currentListId),
			list = todoList[currentListId],
			newTask, taskId;
		
		if(currentTask.value) {
			taskId = list.id + '.' + idTask;
			newTask = new Task(taskId, currentTask.value);
			list.taskList[taskId] = newTask;

			createTask(newTask, list);

			idTask++;
			currentTask.value = '';
		}

	}

	//Function to create the task area with all the elements, task description, edit and delete task buttons 
	function createTask(task, list) {
		var taskArea, taskDetails, taskName, taskButtons, editTaskButton, deleteTaskButton,
			listId = list.id,
			taskContainer = document.getElementById('tasks_'+listId);

		//Div element for adding task
		taskArea = document.createElement('div');
		taskArea.setAttribute('class', 'task-list');
		taskArea.setAttribute('id', task.id);

		//Div element containing all the task details
		taskDetails = document.createElement('div');
		taskDetails.setAttribute('class', 'task-details');
		taskArea.appendChild(taskDetails);

		//Span element containing task description
		taskName = document.createElement('span');
		taskName.setAttribute('id', 'description_'+task.id);
		taskName.innerHTML = task.description;
		taskDetails.appendChild(taskName);

		//Div element for specific task edit and delete buttons
		taskButtons = document.createElement('div');
		taskButtons.setAttribute('class', 'task-buttons');
		taskDetails.appendChild(taskButtons);

		//Delete selected Task by clicking the delete button which calls deleteTask function 
		deleteTaskButton = document.createElement('button');
		deleteTaskButton.setAttribute('class', 'delete-button floatRight');
		deleteTaskButton.textContent = 'Delete'
		deleteTaskButton.task = task;
		deleteTaskButton.listId = listId;
		deleteTaskButton.addEventListener('click', deleteTask);
		taskButtons.appendChild(deleteTaskButton);

		//Edit selected Task by clicking the edit button which calls editTask function
		editTaskButton = document.createElement('button');
		editTaskButton.setAttribute('class', 'edit-button floatRight');
		editTaskButton.textContent = 'Edit';
		editTaskButton.task = task;
		editTaskButton.listId = listId;
		editTaskButton.addEventListener('click', editTask);
		taskButtons.appendChild(editTaskButton);

		taskContainer.appendChild(taskArea);
	}

	//Function to edit task within the list of the selected task which checks if the edit task element is already present
	//if the edit task element is not present than this function creates one for the specific task, this function also hides
	//the original task details area and shows the edited description of the task
	function editTask(event) {
		var selectedTask = event.target,
			listId = selectedTask.listId,
			taskId = selectedTask.task.id,
			taskElement = document.getElementById(taskId),
			elementToShow, elementToHide,	
			editTaskElement = document.getElementById('editTaskElement_'+taskId);

		//Check if a edit task element already exists if not then create one else change the value of the edit task element
		if(!editTaskElement) {
			editTaskElement = createEditTaskElement(listId, selectedTask.task);
			taskElement.appendChild(editTaskElement);
		} else {
			document.getElementById('editTask_'+taskId).value = selectedTask.task.description;
		}

		//hide the original task description and show the edited task description
		document.getElementById('editTask_'+taskId).focus();
		
		showElement(taskElement.childNodes[1]);
		hideElement(taskElement.childNodes[0]);
	}

	//Function to create a edit task element used in the edit task function, this element contains edit task container which
	//contains a text area for the description and done button for adding the edited description to the task
	function createEditTaskElement(listId, task) {
		var editTaskArea, editTaskDescription, doneButton,
			taskId = task.id;

		//create a div element for the edit task element
		editTaskArea = document.createElement('div');
		editTaskArea.setAttribute('id', 'editTaskElement_'+taskId);

		//create a text area to edit the current task's description
		editTaskDescription = document.createElement('textarea');
		editTaskDescription.setAttribute('id', 'editTask_'+taskId);
		editTaskDescription.setAttribute('class', 'edit-task-textarea');
		editTaskDescription.value = task.description;
		editTaskArea.appendChild(editTaskDescription);

		//create to done button to save the changes of the task description
		doneButton = document.createElement('button');
		doneButton.setAttribute('class', 'task-buttons');
		doneButton.textContent = 'Done'
		doneButton.task = task;
		doneButton.listId = listId;
		doneButton.addEventListener('click', saveEditTask);
		editTaskArea.appendChild(doneButton);

		return editTaskArea;
	}

	//The below function is assigned to the done button in the edit task element, this function changes the old task
	//descritpion to new task description when done button is clicked 
	function saveEditTask(event) {
		var selectedTask = event.target,
			listId = selectedTask.listId,
			previousTask = selectedTask.task,
			taskId = previousTask.id,
			currentTask = document.getElementById('editTask_'+taskId),
			newTaskDescription = currentTask.value,
			taskElement = document.getElementById(taskId),
			elementToShow, elementToHide;

		if(newTaskDescription) {
			previousTask.descritpion = newTaskDescription;
			document.getElementById('description_'+taskId).innerHTML = newTaskDescription;	
			
			showElement(taskElement.childNodes[0]);
			hideElement(taskElement.childNodes[1]);
		}
	}

	//Function to delete the task by selecting the listID and taskId as we have assigned in the create Task function 
	function deleteTask(event) {
		var selectedTask = event.target;
			listId = selectedTask.listId;
			taskId = selectedTask.task.id;
			list = todoList[listId];

		if(list) {
			delete list.taskList[taskId];
			removeElement(taskId);
		}
	}

	//Remove the element 
	function removeElement(id) {
		var listDiv = document.getElementById(id),
			listParentDiv = listDiv.parentElement;

		listParentDiv.removeChild(listDiv);
	}

	//display the hidden element
	function showElement(element) {
		element.classList.remove('hide');
		element.classList.add('show');
	}

	//hide the displayed element
	function hideElement (element) {
		element.classList.remove('show');
		element.classList.add('hide');
	}

	return {
		addList: addList
	};

}();
