import React from 'react';

const newsTickerItems = [
  'މިއަދު: މާލެގައި މަސްކީދުގެ ހަމައެކު މަޤާމަށް އަންނަންވާލައިފި',
  'މިއަދު: ހައްޓީ ދިން ފިންހާ ބައިން ސެންޓަރުން ފުރުހަތަށް ބަހައްޓާގެ މީހުންނާ މަސްލިސް އެންނައިގެ ބައިންސް އެދުމަށް ގުޅުން',
  'މިއަދު: މަޖިލިސްތަކަށް ސެހިޔާގެ ރިސްކު ބަލާވެއްޖޮސް ދެއްކުން މިހާން ބައިންސެސް ޚިދުމާގެ',
];

export default function NewsTicker() {
  return (
    <div className="w-full bg-sky-600 text-white py-2 px-4 overflow-hidden flex items-center">
      <span className="font-bold mr-4">ނިއުސް ޓިކަރ:</span>
      <div className="flex-1 whitespace-nowrap overflow-hidden">
        <div className="inline-block animate-marquee">
          {newsTickerItems.map((item, idx) => (
            <span key={idx} className="mx-8">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
