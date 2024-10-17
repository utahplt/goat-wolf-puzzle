const animal1 = Goat
const goat_url = 'https://openclipart.org/image/800px/17824'

const animal2 = Wolf
const wolf_url = 'https://openclipart.org/image/800px/9171'

const boat_url = 'https://openclipart.org/image/800px/170645'
const arrow_url = 'https://openclipart.org/image/800px/193052'

function get_animal_position(animal,st){
  const ans = animal.join(st.join(gwshore)).toString() ;
  if(st.toString() == "GWState4"){
    console.log("animal ",animal.toString()," has pos ",ans);
  }
  return ans;
}

function make_animal(url) {
  const img = document.createElement('img')
  img.src = url
  img.style.width = '100%'
  img.style.height = '15%'
  img.style.display = 'block'
  img.style['margin-bottom'] = '10%'

  return img;
}

function make_blank() {
  const div = document.createElement('div')
  div.style.width = '100%'
  div.style.height = '15%'
  div.style.display = 'block'
  div.style['margin-bottom'] = '10%'

  return div;
}


function make_boat(side) {
  const boat_img = document.createElement('img')
  boat_img.src = boat_url
  boat_img.style.width = '20%'
  boat_img.style['margin-top'] = '-26%'
  boat_img.style['margin-left'] = '15%'
  boat_img.style['margin-right'] = '15%'

  if (side.startsWith('Near')) {
    boat_img.style.float = 'left'
  } else {
    boat_img.style.float = 'right'
    boat_img.style.transform = 'scaleX(-1)';
  }

  return boat_img
}

function make_arrow(direction) {
  const arrow_img = document.createElement('img')
  arrow_img.src = arrow_url
  arrow_img.style.width = '90%'
  arrow_img.style.height = '12%'
  arrow_img.style['margin-bottom'] = '10%'
  arrow_img.style['margin-left'] = '5%'
  arrow_img.style['margin-right'] = '5%'

  if (direction === "left") {
    arrow_img.style.float = 'left'
    arrow_img.style.transform = 'scaleX(-1)';
  } else {
    arrow_img.style.float = 'right'
  }

  return arrow_img
}

div.replaceChildren() // remove all content

let state = GWState;
while (gwnext.join(state).tuples().length > 0) {
  state = gwnext.join(state)
}
let i = 0;
do {
  const pre = state;
  const post = state.join(gwnext)
  const side = state.join(gwboat).tuples()[0].toString();

  function shift_near_far(animal){
   return get_animal_position(animal,pre).includes(Near.toString()) &&
     get_animal_position(animal,post).includes(Far.toString())
  }

  function to_move(animal, dir) {
    if(post.toString()=="") {return;}
     return get_animal_position(animal,post) != get_animal_position(animal,pre)
  }

  function make_side(side, side_str) {
    const div = document.createElement('div')
    div.style.width = '20%'
    div.style.height = '100%'
    div.style.float = side_str

    for (const ind in animal1.tuples()) {
      const animal = animal1.tuples()[ind]
      const on_side = get_animal_position(animal,state).includes(side.toString());
      if (on_side) {
        div.appendChild(make_animal(goat_url))
      } else {
        div.appendChild(make_blank())
      }
    }

    for (const ind in animal2.tuples()) {
      const animal = animal2.tuples()[ind]

      const on_side = get_animal_position(animal,state).includes(side.toString());
      if (on_side) {
        div.appendChild(make_animal(wolf_url))
      } else {
        div.appendChild(make_blank())
      }
    }

    return div
  }

  function make_arrows() {
    const div = document.createElement('div')
    div.style.marginTop = "3%"
    div.style.width = '60%'
    div.style.height = '104%'
    div.style.float = 'left'

    const dir = side.startsWith('Near') ? 'right' : 'left'

    for (const animal of animal1.tuples()) {
      let arr = make_arrow(dir);
      if (!to_move(animal, dir)) {
        arr.style.opacity = '0%'
      }

      div.appendChild(arr);
    }

    for (const animal of animal2.tuples()) {
      let arr = make_arrow(dir);
      if (!to_move(animal, dir)) {
        arr.style.opacity = '0%'
      }

      div.appendChild(arr);
    }

    return div;
  }

  const near_div = make_side(Near, 'left')

  const arrow_div = make_arrows()
  const far_div = make_side(Far, 'right')

  const boat_div = make_boat(side)

  const pree = document.createElement('pre')
  pree.style.width = '31%'
  pree.style.height = '20%'
  pree.style.margin = '1%'
  pree.style.marginRight = '0'
  pree.style.padding = '0.5em'
  pree.style.border = '3px solid black'
  pree.style.display = 'inline-block'
  div.style["background-color"] = 'slateGrey'
  pree.style["background-color"] = '#ffbaea'

  pree.appendChild(near_div)
  pree.appendChild(far_div)
  pree.appendChild(arrow_div)
  pree.appendChild(boat_div)


  div.appendChild(pree)


  state = state.join(gwnext);
  i++;
} while (state.tuples()[0]);
