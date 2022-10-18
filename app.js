//storage controller
const StorageCtrl = (function(){
    //public methods
    return{
        storeItem: function(item){
            let items;
        
            //check if anything in local storage , if nothing is there then
        if(localStorage.getItem('items') === null){
            
            items = [];

            //push the new item in to the item array
            items.push(item);
            
            //store the items in  local storage
            localStorage.setItem('items',JSON.stringify(items));

        }else{

            //take out whatever in local storage
            items = JSON.parse(localStorage.getItem('items'));//convert string to an object

            //push new item
            items.push(item);

            //store back in to local storage
            localStorage.setItem('items',JSON.stringify(items));
        }    
    }, 
    getItemsFromStorage: function(){
        let items;
        if(localStorage.getItem('items') === null){
            items = [];

        }
        else{
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;

    },
    updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item ,index){
            if(updatedItem.id === item.id){
                items.splice(index, 1, updatedItem);

            }
        });
        localStorage.setItem('items',JSON.stringify(items));
    },
     deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item, index){
            if(id ===item.id){
                items.splice(index, 1);
            }
        });
        localStorage.setItem('items',JSON.stringify(items));
     },
     clearItemsFromStorage: function(){
        localStorage.removeItem('items');
     }
}
})();


//item controller
const ItemCtrl = (function(){
    
    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories =calories;
    }

    //data Structure / State
    const data = { //this is private
        //items: [
           // {id: 0, name: 'Breakfast with Coffee', calories: 300},
            //{id: 1, name: 'Pothichoru', calories: 500},
            //{id: 2, name: 'Biriyani', calories: 1200}
        //],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return{
        getItems: function(){
            return data.items;
        },
        addItem : function(name,calories){
            let ID;
            
            //create ID
            if(data.items.length>0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //calories to numbers
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);
            //add to items array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function(id){
            let found = null;
            
            //loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //calories to a number because we taking the value from a form
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //get ids
            const ids = data.items.map(function(item){//map() creates a new array from calling a function for every array element.
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index,1);

        },
        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories : function(){
            let total = 0;
            //loop through items and add calories 
            data.items.forEach(function(item){
                total += item.calories;
            }); 
            //adding total calories to data 
            data.totalCalories = total;

            //return total
            return data.totalCalories;
        },
   
        logData: function(){
            return data;
        }
    }
})();//immediately invoked function expression




//UI controller
const UICtrl = (function(){
  
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    //public methods
    return{
       populateItemList: function(items){
        
        let html= '';
        items.forEach(function(item){
            html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories}
            Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>` ;
        });

        //insert list items in ul
        document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput : function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        }, 
        addListItem: function(item){
            //create li element
            const li = document.createElement('li');
            //add classname to li
            li.className = 'collection-item';
            //add id  
            li.id = `item-${item.id}`;

            //add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}
            Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;

            //insert item as adjascent element of old items in item list before end
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);

        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //above code gives a node list of list items . we cannot apply forEach function to a node list. so we have to convert it to an array
            
            //turn node list  in to an array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML =  `<strong>${item.name}: </strong> <em>${item.calories}
                    Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn nodelist into an array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove;
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
          },
        showList: function(){
            document.querySelector(UISelectors.itemList).style.display = ' block';
        },  
        
        showTotalCalories: function(totalCalories){
          document.querySelector(UISelectors.totalCalories).textContent = totalCalories;  
        },
        clearEditState : function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            

        },
       
        
        showEditState : function(){
           
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            

        },
        getSelectors: function(){
            return UISelectors;//so that we can access the UISelectors othewise it is private
        }
       }
    }
)();//immediately invoked function expression





//app controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    //load event listeners
    const loadEventListeners = function(){
        //get UI Selectors  
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);//addbtn for the button , add meal

        //disable submit when click on the 'enter' button
        //or disabling the enter key
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which ===13){
                e.preventDefault();
                return false;
            }
        });
        //edit item when clicking edit button
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //update item when clicking update button
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //delete item when clicking the delete button
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);


        //clear all when clicking back button and go back to initial state with only add button
        document.querySelector(UISelectors.backBtn).addEventListener('click',clearEditStateBackBtn);

        //clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

    }

    //add item submit
    const itemAddSubmit = function(e){
       
        //get form input from UI controller
        const input = UICtrl.getItemInput();
       
        //check for name and calorie input
        if(input.name !=='' && input.calories !== ''){
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add items to the UI list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //show total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //show list
            UICtrl.showList();

            //store in local storage
            StorageCtrl.storeItem(newItem);

            //clear input fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    } 

    //item editing when clicking pencil icon
    const itemEditClick = function(e){
       if(e.target.classList.contains('edit-item')){
         
         //get list-item id ie, item-0, item-1 etc
         const listId = e.target.parentNode.parentNode.id;
         
         //break the list-item id into an array
         const listIdArr = listId.split('-');
         
         //get the actual id
         const id = parseInt(listIdArr[1]);

         //get item using id
         const itemToEdit = ItemCtrl.getItemById(id);

         //set current item
         ItemCtrl.setCurrentItem(itemToEdit);

         //add current item to the form
         UICtrl.addItemToForm();

       } 
      e.preventDefault();
    }
    //when clicking update meal button , updating and submitting (after editing)
     const itemUpdateSubmit = function(e){

        //get item input
       const input = UICtrl.getItemInput();

       //update item
       const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

       //update UI
       UICtrl.updateListItem(updatedItem);

       //get total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       //show total calories to UI
       UICtrl.showTotalCalories(totalCalories);

       //update local storage
       StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
     }

     //back button press

     const clearEditStateBackBtn = function(){
        UICtrl.showList();
        UICtrl.clearEditState();
     }
    
    //delete button event
     const itemDeleteSubmit = function(e){
        
       //get current item
       const currentItem = ItemCtrl.getCurrentItem();

       //delete current item from data structure
       ItemCtrl.deleteItem(currentItem.id);

       //delete from UI
       UICtrl.deleteListItem(currentItem.id);

       //get total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       //show total calories to UI
       UICtrl.showTotalCalories(totalCalories);

       //delete from local storage
       StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

       e.preventDefault();
     }
     
     //clear items by clicking clear all button

     const clearAllItemsClick = function(){
        //delete all items from data structure
        ItemCtrl.clearAllItems();

         //get total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       //show total calories to UI
       UICtrl.showTotalCalories(totalCalories);


        //remove from UI
        UICtrl.removeItems();

        //clear from local storage
        StorageCtrl.clearItemsFromStorage();

        //hide ul
        UICtrl.hideList();
     }

    //public methods
    return {
        init: function(){
             //clear edit state /set initial state
             UICtrl.clearEditState();
         
            //fetch items from data
        const items = ItemCtrl.getItems();
            
        //populate list with items
        UICtrl.populateItemList(items);

        
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //show total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        
        //load event listeners
        loadEventListeners();
      
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);//immediately invoked function expression

App.init();

