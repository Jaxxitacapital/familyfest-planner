const photos = {
  chicken:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
  beef:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  rice:"https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=85",
  banana:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
  vegetables:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
  chapati:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85"
};

export const kenyanMeals = [
  {
    id:"chicken-beef-bananas", name:"Chicken + Beef Stew + Green Bananas",
    category:"Celebration", tags:["Kenyan","Family","Protein-heavy"],
    photo:photos.chicken, description:"A hearty group meal built around chicken, beef and green bananas.",
    ingredients:[
      {priceId:"chicken", qty:5}, {priceId:"beef", qty:2}, {priceId:"banana", qty:10},
      {priceId:"oil", qty:1}, {priceId:"salt", qty:1}, {priceId:"onion", qty:1},
      {priceId:"tomato", qty:1}, {priceId:"ginger", qty:1}, {priceId:"spice", qty:1},
      {priceId:"dhania", qty:1}, {priceId:"pepper", qty:1}
    ]
  },
  {
    id:"chicken-rice", name:"Chicken Stew + Rice + Vegetables",
    category:"Balanced", tags:["Kenyan","Balanced","Family"],
    photo:photos.rice, description:"A balanced option that reduces protein cost and gives everyone a reliable staple.",
    ingredients:[
      {priceId:"chicken", qty:3}, {priceId:"rice", qty:2}, {priceId:"sukuma", qty:4},
      {priceId:"oil", qty:1}, {priceId:"salt", qty:1}, {priceId:"onion", qty:1},
      {priceId:"tomato", qty:1}, {priceId:"ginger", qty:1}, {priceId:"spice", qty:1}
    ]
  },
  {
    id:"beef-rice", name:"Beef Stew + Rice + Sukuma",
    category:"Economy", tags:["Kenyan","Economy","Balanced"],
    photo:photos.beef, description:"A lower-cost group menu using beef as the main protein and vegetables for volume.",
    ingredients:[
      {priceId:"beef", qty:2}, {priceId:"rice", qty:3}, {priceId:"sukuma", qty:7},
      {priceId:"oil", qty:1}, {priceId:"salt", qty:1}, {priceId:"onion", qty:1},
      {priceId:"tomato", qty:1}, {priceId:"ginger", qty:1}, {priceId:"spice", qty:1}
    ]
  },
  {
    id:"beans-rice", name:"Beans + Rice + Vegetables",
    category:"Economy", tags:["Kenyan","Vegetarian","Economy"],
    photo:photos.vegetables, description:"A high-volume, budget-conscious meal for larger groups.",
    ingredients:[
      {priceId:"beans", qty:3}, {priceId:"rice", qty:3}, {priceId:"sukuma", qty:8},
      {priceId:"oil", qty:1}, {priceId:"salt", qty:1}, {priceId:"onion", qty:1},
      {priceId:"tomato", qty:1}, {priceId:"ginger", qty:1}, {priceId:"spice", qty:1}
    ]
  },
  {
    id:"beef-bananas", name:"Beef Stew + Green Bananas",
    category:"Balanced", tags:["Kenyan","Traditional"],
    photo:photos.banana, description:"Traditional-feeling menu with beef stew and green bananas.",
    ingredients:[
      {priceId:"beef", qty:2}, {priceId:"banana", qty:10}, {priceId:"oil", qty:1},
      {priceId:"salt", qty:1}, {priceId:"onion", qty:1}, {priceId:"tomato", qty:1},
      {priceId:"ginger", qty:1}, {priceId:"spice", qty:1}, {priceId:"dhania", qty:1}
    ]
  },
  {
    id:"chapati-beef", name:"Beef Stew + Chapati + Kachumbari",
    category:"Celebration", tags:["Kenyan","Celebration"],
    photo:photos.chapati, description:"A social meal designed for sharing and a more festive feel.",
    ingredients:[
      {priceId:"beef", qty:2}, {priceId:"wheat", qty:4}, {priceId:"oil", qty:2},
      {priceId:"salt", qty:1}, {priceId:"onion", qty:1}, {priceId:"tomato", qty:2},
      {priceId:"dhania", qty:1}, {priceId:"pepper", qty:1}, {priceId:"lemon", qty:1}
    ]
  }
];
