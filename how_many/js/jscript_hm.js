
$(document).ready(function() {
// shown in the header text
var QUIZ_SUBJECT = 'Units';

// shown in the sub-header text
var QUIZ_DETAILED_SUBJECT = 'AS Physics Units of Measurement';

// the time limit, in minutes
var QUIZ_TIME_LIMIT = 2;

// array of all the correct answers
var QUIZ_ANSWERS = ['kilo grams', 'gram', 'second', 'meter', 'newton meter', 'nano second', 'pascal', 'joule', 'joule per second', 'watt', 'meter squared', 'meter cubed', 'newton second', 'femto meter', 'nano meter', 'mega watt', 'kilo watt', 'amp', 'milli amp', 'micro amp', 'volt', 'ohm', 'kilo ohm', 'joule second', 'hertz', 'meter per second', 'electron volt', 'ohm meter', 'newton per meter squared', 'newton per meter', 'couloumb', 'joule per coulomb', 'coulomb per second', 'newton', 'giga joules'];

/*

You don't need to mess with anything past this point. Unless you want to, of course. :)

*/

var HAPPY_TIME = 1000; // how long to stay happy, in ms
var NEUTRAL_TIME = 5000; // how long to stay neutral, in ms

// timers
var toastMoodTimeout;
var timeInterval;

// other global variables
var answers;
var timeRemaining;
var score;

$(function () {
  // fill in the blanks
  $('.subject').text(QUIZ_SUBJECT);
  $('.detailed-subject').text(QUIZ_DETAILED_SUBJECT);
  $('.time-limit').text(QUIZ_TIME_LIMIT + ' ' + (QUIZ_TIME_LIMIT === 1 ? 'minute' : 'minutes'));
  
  // bind events
  $('.start').on('click', startQuiz);
  $('.input').on('input', checkInput);
  $('.toggle').on('click', toggleAnswers);
  $('.reset').on('click', reset);
  
  // preload other toast moods
  preloadImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/77020/toasty-quiz-happy.png');
  preloadImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/77020/toasty-quiz-neutral.png');  
});

function preloadImage(src) {
  var img = new Image();
  img.src = src;
}

function startQuiz() {
  // init some variables
  initAnswers();
  timeRemaining = Math.round(QUIZ_TIME_LIMIT * 60);
  score = 0;
  
  // prepare UI
  $('.time-remaining').text(getTimeString());
  $('.score').text(score);
  $('.total').text(QUIZ_ANSWERS.length);
  $('.start').hide();
  $('.started').show();
  $('.input').focus();

  // start the clock
  timeInterval = setInterval(reduceTime, 1000);
  setToastMood('neutral');
}

function initAnswers() {
  answers = {};
  QUIZ_ANSWERS.forEach(function(item) {
    var answer = item.trim().toLowerCase()
    answers[answer] = false;
  });
}

function setToastMood(mood, isPermanent) {
  $('.toast')
    .removeClass('neutral-toast happy-toast sad-toast')
    .addClass(mood + '-toast');

  clearTimeout(toastMoodTimeout);
  if (!isPermanent) {
    if (mood === 'happy') {
      // happy toast becomes neutral toast
      toastMoodTimeout = setTimeout(setToastMood.bind(undefined, 'neutral'), HAPPY_TIME);
    } else if (mood === 'neutral') {
      // neutral toast becomes sad toast
      toastMoodTimeout = setTimeout(setToastMood.bind(undefined, 'sad'), NEUTRAL_TIME);
    }
  }
}

function reduceTime() {
  timeRemaining--;
  if (timeRemaining === 0) {
    endQuiz();
  } else {
    $('.time-remaining').text(getTimeString());
  }
}

function checkInput(event) {
  var input = event.currentTarget.value.trim().toLowerCase();
  if (answers.hasOwnProperty(input) && !answers[input]) {
    // give credit
    answers[input] = true;
    score++;
    $('.score').text(score);
    $('.scored-answers').prepend(createAnswerItem(input));
    setToastMood('happy');
    
    // clear input
    $('.input').val('');
    
    // check if user beat the quiz
    if (score === QUIZ_ANSWERS.length) {
      endQuiz();
    }
  }
}

function endQuiz() {
  // freeze
  clearTimeout(timeInterval);
  $('.input').prop('disabled', true);
  
  // calculate percentage
  var percent = Math.round(score / QUIZ_ANSWERS.length * 100);
  $('.percent').text(percent);

  // change status stuff
  $('.status-timer, .status-current-score').hide();
  $('.status-final-results').show();
  $('.footnote').show();

  // score-dependent stuff
  if (score === QUIZ_ANSWERS.length) {
    // happy
    $('.end-greeting').text('Perfect, with ' + getTimeString() + ' remaining!');
    setToastMood('happy', true);
  } else if (score > 0) {
    // neutral
    $('.end-greeting').text('Time\'s up!');
    setToastMood('neutral', true);
    renderMissedAnswers();
    $('.status-toggle-answers').show();
  } else {
    // sad
    $('.end-greeting').text('Nothing...');
    setToastMood('sad', true);
    renderMissedAnswers();
    $('.scored-answers').hide();
    $('.missed-answers').show();
  }
}

function renderMissedAnswers() {
  QUIZ_ANSWERS.forEach(function(item) {
    var answer = item.trim().toLowerCase()
    if (!answers[answer]) {
      $('.missed-answers').append(createAnswerItem(answer));
    }
  });
}

function toggleAnswers(event) {
  event.preventDefault();
  
  if ($('.scored-answers').is(':visible')) {
    // switch to missed answers
    $('.toggle').text('see what you got');
    $('.scored-answers').hide();
    $('.missed-answers').show();
  } else {
    // switch to scored answers
    $('.toggle').text('see what you missed');
    $('.missed-answers').hide();
    $('.scored-answers').show();
  }
}

function createAnswerItem(answer) {
  return $('<li>', { text: answer });
}

function getTimeString() {
  if (timeRemaining <= 0) {
    return '0:00';
  } else {
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  }
}

function reset() {
  // put everything back the way it was
  $('.started, .status-final-results, .status-toggle-answers, .missed-answers, .footnote').hide();
  $('.start, .status-timer, .status-current-score, .scored-answers').show();
  $('.input').prop('disabled', false).val('');
  $('.answers').empty();
  $('.toggle').text('see what you missed');
  setToastMood('neutral', true);
}

});
