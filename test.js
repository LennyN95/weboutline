// @ if's and for's and while's and switch(){} and catch(){} should not be detected
var test = true;
if(test){

}

for(var i in [1,2]){
  console.log(i);
}

switch(test){
  case 1:
    alert('1');
    break;
  case 2:
    alert('2');
    break;
}

while(test){
  console.log(test);
  test = false;
}

// @ normal js function
function myFunction(){
  return true;
}

// @ function with parameters

function myFunction(foo, bar){
  return foo + bar;
}

// @ function in object

var obj = {
  str: 'some text',
  myObjFunc: function(){
    return true;
  },
  myObjParamFunc: function(foo, bar){
    return foo + bar;
  }
};

// @ function in variable

var myVarFunc = function(){
  return false;
}

var myVarParamFunc = function(foo, bar, callback){
  return foo + bar + callback();
}

// @ anonymous functions
myVarParamFunc(1, 2, function(){
  return 3;
});

// @ use some js build in function (should NOT show up)
var str = 'somestring';
str = str.substr(0,5);
