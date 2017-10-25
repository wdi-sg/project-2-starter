const $searchInput = $('#searchInput')
const $searchResults = $('#searchResults')

  $searchInput.on('keyup', e => { // e is the event object of the keyup event
    var keyword = e.target.value
    var json = JSON.stringify({
      keyword
    })

    // console.log e to make it clear
    // https://developer.mozilla.org/en-US/docs/Web/Events/keyup

    // PITSTOP: SPLIT RIGHT WITH INDEX.JS `/search` for better understanding
    fetch('/search', {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json()) // convert the json file into js object
    .then(showResults) // at this point we got the data
    .catch(err => console.log(err))
  })

  // UPDATE AFTER CLASS 20 OCT
  // separate the function, so it's less cluttered
  // PSEUDOCODE
  // - retrieved the data => expecting an array of 10 restaurants
  // - clear the search results area
  // - map them to array of 10 `<li>` object
  // - append them to the `<ul id="searchResults">`

  // PSEUDOCODE 22 Oct - to follow closely the homepage
  // - limit to 9 array search results instead
  // - map them to array of 10 `<div class="col-4">` obj
  // - append them to a new `<div class="row">`

  // - NOTICE: for easy checking, split this screen side by side with `home.handlebars`

  function showResults (data) {
    let allLocations = data.map(location => {
      const $newCol = $('<div class="col-4">')
      const $newCard = $('<div class="card">')
      const $newCardBody = $('<div class="card-body">')
      const $newCardTitle = $('<h4 class="card-title">')
      const $newCardText = $('<p class="card-text">')
      const $newCardLinks = $(`<form
        class="form-inline"
        action="/locations/${location.id}?_method=DELETE"
        method="post"
      >`)

      $newCardTitle.text(location.name)
      $newCardText.html(
        `
          ${location.country} ${location.type}<br>
          ${location.title}<br>
          ${location.description}
        `
      )

      $newCardBody.append($newCardTitle, $newCardText)

      // TODO: add the form section too

      $newCard.append($newCardBody)
      $newCol.append($newCard)
      return $newCol

      // UPDATE 22 Oct, we dont use the structure below anymore

      // // UPDATE AFTER 20 Oct
      // // add link to the list, so you can click on the restaurant name
      // var $newA = $('<a>')
      // $newA.attr('href', `/restaurants/${restaurant._id}`)
      // $newA.text(restaurant.name)
    })

    $searchResults.html('')
    $searchResults.append(allLocations)
  }
})
