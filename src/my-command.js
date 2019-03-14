
function traverseRecursiveAndTakeAction(layerGroup, predicateFunc, actionFunc){
  if(layerGroup.type != 'Group' && layerGroup.type != 'Artboard'){
    return
  }
  for(var layer of layerGroup.layers){
    if(predicateFunc(layer)){
      actionFunc(layer)
    }
    traverseRecursiveAndTakeAction(layer, predicateFunc, actionFunc)
  }
}


function setVisibilityOnAllLayersOnArtboard(artboard, isVisible){
  const truePredicate = function(layer) { return true }
  const action = function(layer){
    layer.hidden = !isVisible
  }
  traverseRecursiveAndTakeAction(artboard, truePredicate, action)
}

function hideAllLayersExceptImageLayers(artboard){
  setVisibilityOnAllLayersOnArtboard(artboard, false)
  const predicate = function(layer){ return layer.type == 'Image' }
  const action = function(layer){
    layer.hidden = false
    var parent = layer.parent
    while(parent && (parent.type == 'Group' || parent.type == 'Artboard')){
      parent.hidden = false
      parent = parent.parent
    }
  }
  traverseRecursiveAndTakeAction(artboard, predicate, action)
}


export default function () {
  var sketch = require('sketch')
  const document = sketch.fromNative(context.document)
  const page = document.selectedPage
  const selected = page.selectedLayers
  if(selected.isEmpty || selected.layers[0].type != 'Artboard'){
    sketch.UI.message('You should select artboard first')
  } else {
    const artboard = selected.layers[0]
    hideAllLayersExceptImageLayers(artboard)
  }
}
