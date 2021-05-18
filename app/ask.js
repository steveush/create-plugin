const _ = require('lodash');
const readline = require('readline');

async function ask(questions) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    try {
        for (const question of questions) {
            question.answer = await new Promise((resolve) => {
                let text = question.text;
                if (!text.endsWith(": ")){
                    text += ": ";
                }
                const hasDefault = _.isString(question.default)
                if (hasDefault){
                    text += "(" + question.default + ") "
                }
                rl.question(text, (answer) => {
                    if (answer.length === 0 && hasDefault){
                        answer = question.default;
                    }
                    resolve(answer);
                });
            });
        }
        return questions.reduce((answers, question) => {
            _.set(answers, question.property, question.answer);
            return answers;
        }, {});
    } finally {
        rl.close();
    }
}

/**
 *
 * @param prop
 * @param text
 * @param def
 * @returns {{def, prop, text}}
 */
ask.createQuestion = (prop, text, def) => {
    return { prop, text, def };
};

module.exports = ask;