class House{
  constructor(color){
    this.color = color;
  }

getFurniture(){
    return 'sofa'
  }
}

const houseObject = new House('red')
const houseObject2 = new House('green')

console.log(houseObject.color)
console.log(houseObject.getFurniture())

console.log(houseObject2.color)
console.log(houseObject2.getFurniture())