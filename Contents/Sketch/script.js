          var onRun = function(context) {
          let sketch = require('sketch')

var UI = require('sketch/ui')

let doc = sketch.getSelectedDocument()
let selectedLayer = doc.selectedLayers.layers[0]

const attrStr = selectedLayer.sketchObject.attributedStringValue()
let limitRange = NSMakeRange(0, attrStr.length())
let effectiveRange = MOPointer.alloc().init()
let length = attrStr.length()


let styleOfSelectedTextLayer = selectedLayer.fragments
  console.log(styleOfSelectedTextLayer)


let exportedValue = {
  name: selectedLayer.name,
  raw: selectedLayer.text,
  fragments: []
}

while(limitRange.length > 0) {
  let attributes = attrStr.attributesAtIndex_longestEffectiveRange_inRange(
      limitRange.location,
      effectiveRange,
      limitRange)
  )
  let fontWeightValue = NSFontManager.sharedFontManager().weightOfFont(attributes.NSFont)
  let attributedSubstring = attrStr.attributedSubstringFromRange(effectiveRange.value())
  
  let differsFromParent = true;

  let property = {
      "differsFromParent" : differsFromParent,
      "string":attributedSubstring.string(),
      "fontWeight": fontWeightValue,
      "colorHex": "#" + attributes.MSAttributedStringColorAttribute.hexValue(),
      "range": { 
        "location": effectiveRange.value().location,
        "length": effectiveRange.value().length
      },
      "fontDisplayName": attributes.NSFont.displayName(),
      "fontFamilyName": attributes.NSFont.familyName(),
      "fontName": attributes.NSFont.fontName(),
      "underline":attributes.NSUnderline == 1 ? true : false,
  }

  console.log(attributes.NSFont)

  exportedValue.fragments.push(property)
  
  limitRange = NSMakeRange(
        NSMaxRange(effectiveRange.value()),
        NSMaxRange(limitRange) - NSMaxRange(effectiveRange.value())
  )
}

//Iterate each fragment convering it to our own parsing language
let exportString = "</content>";
for(fragment of exportedValue.fragments)
{
  let spanAttributes = [];
  
  //Handle decorations
  let decorationAttibuteString = fragment.underline == true ? "decoration='underline'" : "";
  if(fragment.underline == true)
  {    
    spanAttributes.push(decorationAttibuteString)
  }

  //Handle fonts
  let fontName = fragment.fontDisplayName.replace(fragment.fontFamilyName, "").trim();
  let styleAttributeString = "style='" + fontName + "'"; 
  spanAttributes.push(styleAttributeString)

  //Handle colours
  
  
  
  let attributesString = '';
  for(attr of spanAttributes)
  {
    attributesString += ` ${attr}`
  }
  
  exportString += `<span${attributesString}></span>`
}
exportString += "</content>"

console.log(exportString)
console.log(exportedValue)


          };
          