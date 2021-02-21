let sketch = require('sketch')

var UI = require('sketch/ui')

let doc = sketch.getSelectedDocument()

if(doc.selectedLayers.length == 0)
{ 
  UI.alert("Oops", "No text layer selected");
  return;
}

let selectedLayer = doc.selectedLayers.layers[0]

const attrStr = selectedLayer.sketchObject.attributedStringValue()
let limitRange = NSMakeRange(0, attrStr.length())
let effectiveRange = MOPointer.alloc().init()
let length = attrStr.length()


let exportedValue = {
  name: selectedLayer.name,
  raw: selectedLayer.text,
  fragments: []
}

var parentStyle = selectedLayer.style;

console.log(parentStyle)

while(limitRange.length > 0) {
  let attributes = attrStr.attributesAtIndex_longestEffectiveRange_inRange(
      limitRange.location,
      effectiveRange,
      limitRange)
  )
  let fontWeightValue = NSFontManager.sharedFontManager().weightOfFont(attributes.NSFont)
  let attributedSubstring = attrStr.attributedSubstringFromRange(effectiveRange.value())
  
  
console.log("#" + attributes.MSAttributedStringColorAttribute.hexValue())
console.log(parentStyle.textColor)
  let differsInColor = ("#" + attributes.MSAttributedStringColorAttribute.hexValue()) != parentStyle.textColor

  let property = {
      "differsInColor" : differsInColor,      
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

  exportedValue.fragments.push(property)
  
  limitRange = NSMakeRange(
        NSMaxRange(effectiveRange.value()),
        NSMaxRange(limitRange) - NSMaxRange(effectiveRange.value())
  )
}

//Iterate each fragment convering it to our own parsing language
let exportString = "<content>";
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
  let colourAttributeString = "colour='" + fragment.colourHex + "'";
  
  
  let attributesString = '';
  for(attr of spanAttributes)
  {
    attributesString += ` ${attr}`
  }
  
  exportString += `<span${attributesString}>${fragment.string}</span>`
}
exportString += "</content>"

console.log(exportString)
console.log(exportedValue)

UI.alert(exportedValue.name, exportString);

