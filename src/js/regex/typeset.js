define([
  './unicode'
], function( UNICODE ) {

var TYPESET = (function() {
  var rWhite = '[\\x20\\t\\r\\n\\f]'
  // Whitespace characters
  // http://www.w3.org/TR/css3-selectors/#whitespace

  var rPtOpen = UNICODE.punct.open
  var rPtClose = UNICODE.punct.close
  var rPtEnd = UNICODE.punct.end
  var rPtMid = UNICODE.punct.middle
  var rPtSing = UNICODE.punct.sing
  var rPt = rPtOpen + '|' + rPtEnd + '|' + rPtMid
   
  var rBdOpen = UNICODE.biaodian.open
  var rBdClose = UNICODE.biaodian.close
  var rBdEnd = UNICODE.biaodian.end
  var rBdMid = UNICODE.biaodian.middle
  var rBdLiga = UNICODE.biaodian.liga + '{2}'
  var rBd = rBdOpen + '|' + rBdEnd + '|' + rBdMid
   
  var rKana = UNICODE.kana.base + UNICODE.kana.combine + '?'
  var rKanaS = UNICODE.kana.small + UNICODE.kana.combine + '?'
  var rKanaH = UNICODE.kana.half
  var rEon = UNICODE.eonmun.base + '|' + UNICODE.eonmun.letter
  var rEonH = UNICODE.eonmun.half
   
  var rHan = UNICODE.hanzi.base + '|' + UNICODE.hanzi.desc + '|' + UNICODE.hanzi.radical + '|' + rKana
   
  var rCbn = UNICODE.ellinika.combine
  var rLatn = UNICODE.latin.base + rCbn + '*'
  var rGk = UNICODE.ellinika.base + rCbn + '*'
   
  var rCyCbn = UNICODE.kirillica.combine
  var rCy = UNICODE.kirillica.base + rCyCbn + '*'
   
  var rAlph = rLatn + '|' + rGk + '|' + rCy
   
  // For words like `it's`, `Jones’s` or `'99`
  var rApo = '[\u0027\u2019]'
  var rChar = rHan + '|(' + rAlph + '|' + rApo + ')+'

  var rZyS = UNICODE.zhuyin.initial
  var rZyJ = UNICODE.zhuyin.medial
  var rZyY = UNICODE.zhuyin.final
  var rZyD = UNICODE.zhuyin.tone + '|' + UNICODE.zhuyin.ruyun

  return {
    /* Character-level selector (字級選擇器)
     */
    char: {
      punct: {
        all:   new RegExp( '(' + rPt + ')', 'g' ),
        open:  new RegExp( '(' + rPtOpen + ')', 'g' ),
        end:   new RegExp( '(' + rPtEnd + ')', 'g' ),
        sing:  new RegExp( '(' + rPtSing + ')', 'g' )
      },

      biaodian: {
        all:   new RegExp( '(' + rBd + ')', 'g' ),
        open:  new RegExp( '(' + rBdOpen + ')', 'g' ),
        close: new RegExp( '(' + rBdClose + ')', 'g' ),
        end:   new RegExp( '(' + rBdEnd + ')', 'g' ),
        liga:  new RegExp( '(' + rBdLiga + ')', 'g' ),

        group: [
          new RegExp( '(' + rBd + '){2,}', 'g' ),
          new RegExp( '(' + rBdLiga + rBdOpen + ')', 'g' )
        ]
      },

      hanzi: {
        individual: new RegExp( '(' + rHan + ')', 'g' ),
        group:      new RegExp( '(' + rHan + ')+', 'g' )
      },

      word: new RegExp( '(' + rLatn + '|' + rGk + '|' + rCy + '|' + rPt + ')+', 'ig' ),

      alphabet: {
        latin:       new RegExp( '(' + rLatn + ')', 'ig' ),
        ellinika:    new RegExp( '(' + rGk + ')', 'ig' ),
        kirillica:   new RegExp( '(' + rCy + ')', 'ig' ),
        kana:        new RegExp( '(' + rKana + ')', 'g' ),
        smallkana:   new RegExp( '(' + rKanaS + ')', 'g' ),
        eonmun:      new RegExp( '(' + rEon + ')', 'g' ),
        halfeonmun:  new RegExp( '(' + rEonH + ')', 'g' )
      }
    },

    /* Punctuation Rules (禁則)
     */
    jinze: {
      hanging: new RegExp( '((' + rChar + ')' + rBdClose  + '*|[…⋯]*)([、，。．])(?!' + rBdEnd + ')', 'ig' ),
      touwei:   new RegExp( '(' + rBdOpen + '+)(' + rChar + ')(' + rBdEnd + '+)', 'ig' ),
      tou:      new RegExp( '(' + rBdOpen + '+)(' + rChar + ')', 'ig' ),
      wei:      new RegExp( '(' + rChar + ')(' + rBdEnd + '+)', 'ig' ),
      middle:   new RegExp( '(' + rChar + ')(' + rBdMid + ')(' + rChar + ')', 'ig' )
    },

    zhuyin: {
      form:     new RegExp( '^\u02D9?(' + rZyS + ')?(' + rZyJ + ')?(' + rZyY + ')?(' + rZyD + ')?$' ),
      diao:     new RegExp( '(' + rZyD + ')', 'g' )
    },

    /* Hanzi and Western mixed spacing (漢字西文混排間隙)
     * - Basic mode
     * - Strict mode
     */
    hws: {
      base: [
        new RegExp( '('+ rHan +')(' + rAlph + '|' + rPtOpen + ')', 'ig' ),
        new RegExp( '('+ rAlph+ '|' + rPtEnd +')(' + rHan + ')', 'ig' )
      ],

      strict: [
        new RegExp( '('+ rHan +')' + rWhite + '?(' + rAlph + '|' + rPtOpen + ')', 'ig' ),
        new RegExp( '('+ rAlph+ '|' + rPtEnd +')' + rWhite + '?(' + rHan + ')', 'ig' )
      ]
    },

    // The feature displays the following characters
    // in its variant form for font consistency and
    // presentational reason. Meanwhile, this won't
    // alter the original character in the DOM.
    'display-as': {
      'ja-font-for-hant': [
        // '夠 够',
        '查 査',
        '啟 啓',
        '鄉 鄕',
        '值 値',
        '污 汚'
      ],

      'comb-liga-pua': [
        [ '\u0061[\u030d\u0358]', '\uDB80\uDC61' ],
        [ '\u0065[\u030d\u0358]', '\uDB80\uDC65' ],
        [ '\u0069[\u030d\u0358]', '\uDB80\uDC69' ],
        [ '\u006F[\u030d\u0358]', '\uDB80\uDC6F' ],
        [ '\u0075[\u030d\u0358]', '\uDB80\uDC75' ],

        [ '\u31B4[\u030d\u0358]', '\uDB8C\uDDB4' ],
        [ '\u31B5[\u030d\u0358]', '\uDB8C\uDDB5' ],
        [ '\u31B6[\u030d\u0358]', '\uDB8C\uDDB6' ],
        [ '\u31B7[\u030d\u0358]', '\uDB8C\uDDB7' ]
      ]
    },

    // The feature actually *converts* the character
    // in the DOM for semantic reason.
    //
    // Note that this could be aggressive.
    'inaccurate-char': [
      [ '[\u2022\u2027]', '\u00B7' ],
      [ '\u22EF\u22EF', '\u2026\u2026' ],
      [ '\u2500\u2500', '\u2014\u2014' ],
      [ '\u2035', '\u2018' ],
      [ '\u2032', '\u2019' ],
      [ '\u2036', '\u201C' ],
      [ '\u2033', '\u201D' ]
    ]
  }
})()

return TYPESET
})
