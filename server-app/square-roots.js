const { isNumeric, BEGIN_SERVER_ERROR, INVALID_SQRT_HTTP, VALID_SQRT_HTTP } = require("../import-2-require/common-2-require");
const { romanToInt, intToRoman } = require("../import-2-require/roman-numbers-require");
const { wordToInt, intToWord } = require("../import-2-require/word-numbers-require");
const { numberTypeError } = require("../import-2-require/valid-types-require");

function romanSquareRoot(to_sqrt) {
  decimal_number = romanToInt(to_sqrt);
  if (decimal_number instanceof Error) {
    return decimal_number;
  }
  const decimal_sqrt = Math.sqrt(decimal_number);
  const integer_sqrt = Math.trunc(decimal_sqrt);
  let roman_result;
  if (integer_sqrt !== 0 && decimal_sqrt === integer_sqrt) {
    roman_result = intToRoman(integer_sqrt);
  } else {
    roman_result = new Error(BEGIN_SERVER_ERROR + " Cannot represent " + decimal_sqrt + " in Roman numerals");
  }
  return roman_result;
}

function wordSquareRoot(to_sqrt) {
  const trimmed_word = to_sqrt.trim();
  if (trimmed_word.startsWith("-")) {
    const neg_word_error = new Error(BEGIN_SERVER_ERROR + " negative words not supported");
    return neg_word_error;
  }
  decimal_number = wordToInt(to_sqrt);
  if (decimal_number instanceof Error) {
    return decimal_number;
  }
  const decimal_sqrt = Math.sqrt(decimal_number);
  const integer_sqrt = Math.trunc(decimal_sqrt);
  let word_result;
  if (decimal_sqrt === integer_sqrt) {
    word_result = intToWord(integer_sqrt);
  } else {
    word_result = new Error(BEGIN_SERVER_ERROR + " Cannot represent " + decimal_sqrt + " in Words");
  }
  return word_result;
}

function floatSquareRoot(to_sqrt) {
  if (!isNumeric(to_sqrt)) {
    const float_error = new Error(BEGIN_SERVER_ERROR + ", " + to_sqrt + " is not a float");
    return float_error;
  }
  const pos_float = Math.abs(to_sqrt);
  let float_sqrt = Math.sqrt(pos_float);
  if (float_sqrt === Math.trunc(float_sqrt)) {
    float_sqrt += ".0";
  }
  if (to_sqrt < 0) {
    float_sqrt += "i";
  }
  return float_sqrt;
}

function integerSquareRoot(to_sqrt) {
  if (!isNumeric(to_sqrt)) {
    const not_int_error = new Error(BEGIN_SERVER_ERROR + ", " + to_sqrt + " is not a integer");
    return not_int_error;
  }
  const make_number = Number(to_sqrt);
  if (Math.trunc(make_number) != make_number) {
    const not_integer = new Error(BEGIN_SERVER_ERROR + ", " + make_number + " is not an integer");
    return not_integer;
  }
  if (make_number < 0) {
    const pos_integer = Math.abs(make_number);
    const neg_int_sqrt = Math.sqrt(pos_integer);
    if (Math.trunc(neg_int_sqrt) === neg_int_sqrt) {
      return neg_int_sqrt + "i";
    }
    return new Error(BEGIN_SERVER_ERROR + ", " + neg_int_sqrt + "i is not an integer");
  } else {
    const pos_int_sqrt = Math.sqrt(make_number);
    if (Math.trunc(pos_int_sqrt) === pos_int_sqrt) {
      return pos_int_sqrt;
    }
    return new Error(BEGIN_SERVER_ERROR + ", " + pos_int_sqrt + " is not an integer");
  }
}

function getInputNumber(req) {
  const url_parts = req.url.split("/");
  const [_, number_style, to_sqrt] = url_parts;
  let square_root = "-2";
  if (number_style === "roman-style") {
    square_root = romanSquareRoot(to_sqrt);
  } else if (number_style === "word-style") {
    square_root = wordSquareRoot(to_sqrt);
  } else if (number_style === "float-style") {
    square_root = floatSquareRoot(to_sqrt);
  } else {
    square_root = integerSquareRoot(to_sqrt);
  }
  return { number_style, square_root, to_sqrt };
}

function returnSquareRoot(server_style, square_root, to_sqrt, res) {
  let return_status = VALID_SQRT_HTTP;
  let return_text;
  if (numberTypeError(server_style, to_sqrt)) {
    return_text = "Number type did not match the value type";
    return_status = INVALID_SQRT_HTTP;
  } else if (square_root instanceof Error) {
    const wrong_type_mess = square_root.message;
    return_text = JSON.stringify({
      server_style,
      square_root: wrong_type_mess,
    });
  } else {
    const square_root_str = square_root.toString();
    return_text = JSON.stringify({
      server_style,
      square_root: square_root_str,
    });
  }
  res.status(return_status).type("text/plain").send(return_text);
}

module.exports = {
  getInputNumber,
  returnSquareRoot,
};
