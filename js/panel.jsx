// panel to pull and display information from server

/* NAMING CONVENTIONTS
 keywords at the start of a class or variable - all lower case

 test 	- indicates that object has no production features or 
 db		- indicates for debugging purposes

other flags
 G_/{start uppercase} 	- indicates global scoped variable
 {all caps}				- indicates static definition


 Variables use underscore and are lowercase unless global
 function use uppercase and no underscore


*/
var Modal=ReactBootstrap.Modal;
var Navbar=ReactBootstrap.Navbar;
var Nav=ReactBootstrap.Nav;
var NavItem=ReactBootstrap.NavItem;
var NavDropdown=ReactBootstrap.NavDropdown;
var MenuItem=ReactBootstrap.MenuItem;
var Button =ReactBootstrap.Button
var socket;


//Global data structures
var CURRENTUSER=0;
var newItem={
	title: null,
	content: null ,
	user:CURRENTUSER
}
var PendingItems=[]
var Items=[]

/******** CLIENT EMITTED EVENTS *********


addItem	- sends items info in JSON form to server

info   	- [UNUSED] sends empty info

login 	- sends hashed login info for confirmation


*****************************************/


/******** CLIENT RECIEVED EVENTS ********

ConfirmAdd - recieve confirmation of create transaction for items
	recieves bitmask indicating which items failed (0 = success, 1 = failure)

connect - confirm connection to server

error - general error response from server

init - server is ready to recieve informaiton

Login_accept - server has accepted login

*****************************************/	

//var socket = io.connect('104.131.42.153');
//if(socket = io.connect('10.0.0.183:30')){
//	console.log('connect')
//}

// socket.on("connect",function(){
// 	console.log("client connect")
// })

// socket.on("error",function(){
// 	console.log("ERROR")
// })

// socket.on("init",function(){
// 	console.log("logging in");
// 	socket.emit("login",{username:"MASTER", pwd:"TEMPLOGIN"});
// })

// socket.on("login_accept",function(){
// 	console.log('login confirmed')
// })
//socket.on("ADD_sucess",function(){
//	pendingItems=[];
//})

// socket.emit("info",{});

// socket.on("sendTasks",function(data){
//	loadTasks(data)
//})

document.body.addEventListener("unload",Unload);

function Unload(){
	io.close();
}
// TO DO:  
/*
	- login info
	- retreieve data


*/
function pushNewItem(){
	// check if new item is a valid item
	if(newItem){
		if(newItem.content && newItem.content!="")
		{
			// push new item onto pending items
			pendingItems.put(newItem);
			// clear new item
			newItem={
				title: null,
				content: null ,
				user:CURRENTUSER
			}
		}
	}
	
}

function requestItems(flags){
	socket.emit("getTasks",{flags})
}

function loadItems(source){
	// loads items from databse into Items global variable asynchronously
	for (var i = source.length - 1; i >= 0; i--) {
		Items.append(source[i])
	};
}


// TO DO:  create a loop to check for updates and send updates

function updateLoop(){
	pushNewItem()
	// every 30 seconds push items to server
	setTimeout(function(){
		socket.emit("addItem",pendingItems)

	},30000)
}

setTimeout(updateLoop,10000)



var Bar=(// fairly standard bootsrap navbar
	<Navbar>
		<Navbar.Header>
	      <Navbar.Brand>
	        <a href="#">Personal Assistant</a>
	      </Navbar.Brand>
	    </Navbar.Header>
	    <Nav>
	      <NavItem eventKey={1} href="#">[preferences]</NavItem>
	      <NavItem eventKey={2} href="#">[alt view]</NavItem>
	      <NavDropdown eventKey={3} title="Menu"  id="basic-nav-dropdown">
	        <MenuItem eventKey={3.1}>Action</MenuItem>
	        <MenuItem eventKey={3.2}>Another action</MenuItem>
	        <MenuItem eventKey={3.3}>Something else here</MenuItem>
	        <MenuItem divider />
	        <MenuItem eventKey={3.3}>Separated link</MenuItem>
	      </NavDropdown>
	    </Nav>
  	</Navbar>

	)



var ItemBarComponent= React.createClass({
	// defines the new item interface

	defaultText:"write here...",
	defaultTitle:"Title",
	getInitialState:function(){
		return({
			show:false,				// show the advanced interface
			//value:this.defaultText, // 
			title:"" 				// title value for item
		})
	},
	addHandler:function(e){
		// use form information to create item
		e.preventDefault();
		pushNewItem();

		// creates JSON object for maping to new item
		var data={title:"",content:""}
		$(e.target).children().each(
			function(){
				data[this.name]=this.value;

			})
		// maps data object to newItem global object
		newItem['title']=data['title']
		newItem['title']=data['content']
		console.log(data)
		console.log(newItem)
		//socket.emit("add",[data])
	},
	handleClick:function(event){
		this.setState({show:true})
	},
	clearDefault:function(event,defaultVal){
		if(event.target.textContent==defaultVal || event.target.value==defaultVal){
			//console.log("default found")
			//this.setState({value:""})
			event.target.textContent=""	
			event.target.value=""	
		}
	},
	render:function(){
		if(this.state.value==""){
			this.setState({value:this.defaultText});
		}

		if( this.state.show){
			return(
			<div className="item_input">
				<form id="item_form" className="new_item" onSubmit={this.addHandler}>
					<input name="title" className="title_input"  type="text" onClick={(e)=>this.clearDefault(e,this.defaultTitle)} defaultValue="Title"/>
					<div name="content" contentEditable={true} className="content_input" onClick={(e)=>this.clearDefault(e,this.defaultText)} onChange={this.handleChange} >{this.state.value}</div>
				</form>
				<div className="BottomBar">
					<Button>[task]</Button>
					<Button>[img]</Button>
					<Button>[list]</Button>
					<Button type="submit" className="right" form="item_form">+</Button>
				</div>
			</div>
		
			)
		}else{
			return(
				<div>
					<input type="text" className="title_input" onClick={this.handleClick.bind(this)} value="create an item"/>
				</div>
				)
		}
	}
});

// TO BE USED LATER
////////////////////////////////////
var ModalForm= (
	<div className="static-modal">
		<Modal.Dialog>
			<Modal.Body>
			</Modal.Body>
			<Modal.Footer>
			</Modal.Footer>
		</Modal.Dialog>
	</div>	
	)
//////////////////////////////////////


var Main=React.createClass({
	
	render:function(){
		return(
			<div>
				{Bar}
				<ItemBarComponent  />
			</div>
			)
	}
});

ReactDOM.render(
	<Main/>,
	document.getElementById('mainDiv')
	);



var Item_Card=React.createClass({
	// defines a "Card" for displaying data containing title and content
	getInitialstate:function(){
		return(
			data:{}
			)
	},
	render:function(){
		return(
			<div className="Card">
				<div className="item_title">{this.props.data.title}</div>
				<div className="item_description">{this.props.data.description}</div>
				<div className="item_list">
					<ul>
					{this.props.data.list.map(function(item){
						return(
							<li>{item}</li>
							)
					})}
					</ul>
				</div>
			</div>
			)

	}
});

//Defines Gallery-of-cards widget

var Cards=React.createClass({
	getInitialstate:function(){		// TO be used later
		return(
		{
				
		})
	},
	render:function(){
		return(
				<div className="Card_display">
				{	
					// Creates a maping of data (items) to 
					this.props.items.map(function(item){
						return(<Item_Card data={item} />)
					})
				}
				</div>				
			)
	}
})

// Render the Card gallery
ReactDOM.render(
  <Cards items={[]} />,
  document.getElementById('app')
);


