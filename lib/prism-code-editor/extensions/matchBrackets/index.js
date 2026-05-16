const matchBrackets = (rainbowBrackets = true, openingBrackets = "([{", closingBrackets = ")]}") => {
  let bracketIndex;
  let sp;
  const stack = [];
  const self = (editor) => {
    editor.extensions.matchBrackets = self;
    editor.addListener("tokenize", matchBrackets2);
    if (rainbowBrackets && editor.tokens[0])
      editor.update();
    else
      matchBrackets2(editor.tokens);
  };
  const brackets = self.brackets = [];
  const pairMap = self.pairs = [];
  const matchBrackets2 = (tokens) => {
    pairMap.length = brackets.length = sp = bracketIndex = 0;
    matchRecursive(tokens, 0);
    if (rainbowBrackets) {
      for (let i = 0, bracket; bracket = brackets[i]; ) {
        let alias = bracket[0].alias;
        bracket[0].alias = (alias ? alias + " " : "") + `bracket-${i++ in pairMap ? "level-" + bracket[2] % 12 : "error"}`;
      }
    }
  };
  const matchRecursive = (tokens, position) => {
    let token;
    let i = 0;
    for (; token = tokens[i++]; ) {
      let length = token.length;
      if (typeof token != "string") {
        let content = token.content;
        if (Array.isArray(content)) {
          matchRecursive(content, position);
        } else if ((token.alias || token.type) == "punctuation") {
          let openingType = testBracket(content, openingBrackets, length - 1);
          let closingType = openingType || testBracket(content, closingBrackets, length - 1);
          if (closingType) {
            brackets[bracketIndex] = [token, position, 0, content, !!openingType, position + length];
            if (openingType)
              stack[sp++] = [bracketIndex, openingType];
            else {
              for (let i2 = sp; i2; ) {
                let [index, type] = stack[--i2];
                if (closingType == type) {
                  pairMap[pairMap[bracketIndex] = index] = bracketIndex;
                  brackets[bracketIndex][2] = brackets[index][2] = sp = i2;
                  i2 = 0;
                }
              }
            }
            bracketIndex++;
          }
        }
      }
      position += length;
    }
  };
  return self;
};
const testBracket = (str, brackets, l) => {
  return brackets.indexOf(str[0]) + 1 || l && brackets.indexOf(str[l]) + 1;
};
export {
  matchBrackets
};
//# sourceMappingURL=index.js.map
