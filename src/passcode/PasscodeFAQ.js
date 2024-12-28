import React from 'react';
import { timeToCrackAvg, convertTimeToReadableFormat } from './../passphraseUtils.js';
import FAQItem from './../FAQItem';
import MarkdownCustom from '../MarkdownCustom.js';

const formatNumber = (number, precision=3) => {
  let rounded = Number(number.toPrecision(precision));
  return rounded.toLocaleString();
};


export const PasscodeCrackTable = ({ hashRate }) => {

  const generateTableData = () => {
    let data = [];
    for (let length = 6; length <= 15; length += 1) {
      const numberOfGuesses = 10 ** length;
      const entropy = Math.log2(numberOfGuesses)
      // const avgCost = avgCostToCrack(entropy, BASE_COST_PER_32);
      // const roundedCost = formatDollarToScale(avgCost, 2, false);
      const avgTime = timeToCrackAvg(entropy, hashRate);
      const maxTime = avgTime * 2;
      data.push({
        length,
        entropy: formatNumber(entropy, 2),
        guesses: formatNumber(numberOfGuesses),
        avgtime: convertTimeToReadableFormat(avgTime),
        maxtime: convertTimeToReadableFormat(maxTime),
        // cost: roundedCost.toLocaleString()
      });
    }
    return data;
  };

  const tableData = generateTableData();

  return (
    <section className="overflow-x-auto">
      <table className="table table-zebra w-auto">
        <thead>
          <tr>
            <th># of digits in passcode</th>
            <th>Bits of entropy</th>
            <th>Pool of possible guesses</th>
            <th>Avg. Crack Time</th>
            {/* <th>Avg cost to crack</th> */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.entropy}>
              <td className="font-bold">{row.length} digits</td>
              <td>{row.entropy} bits</td>
              <td>{row.guesses}</td>
              <td><strong>{row.avgtime}</strong></td>
              {/* <td><strong>{row.cost}</strong></td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}



const PasscodeFAQ = ({ hashRate }) => {
  return (
    <div className="faq-all">
      <section className="content faq-overall-container markdown-content" id="FAQ">
        <h1 className="section-header">Frequently Asked Questions</h1>

        <div className="faq-container">

          <div className="faq-item" id="cracktime">
            <h2 className="faq-question">How long does it take to crack a passcode?</h2>
            <div className="faq-answer">
              <MarkdownCustom>
                **You can adjust the crack rate using the menu at the top of this page.**

                It is a lot slower than normal password cracking because of something called [Secure Enclave](https://support.apple.com/guide/security/secure-enclave-sec59b0b31ff/web) (this is Apple's name for it, other device makers have other names). 
                This system forces password/passcode checking to be done on the device, which means it can't be scaled up to dozens or hundreds of computers simultaneously guessing.

              </MarkdownCustom>
              <PasscodeCrackTable hashRate={hashRate} />
            </div>
          </div>

          <FAQItem
            question="How do we know the guesses/second?"
            id="secure"
            answer={`
              We have [evidence from 2018](https://www.komando.com/news/how-your-iphone-can-be-hacked-in-6-minutes/) that law enforcement phone cracking software worked at a rate of **25 guesses/second**.
              This is a lot lower than the password hashing rate because passcode hashing must be done on the phone (rather than a more-powerful computer).

              We include 250 guesses/second as a possible imagined high-end option since it's possible that hacking capacities have increased.
              This is unlikely, though, since most phone manufactueres have increased the complexity of their passcode hashing as the power of their processors has gone up. 
            `}
          />

          <FAQItem
            question="What if the generator randomly gives me passcode that is easy to crack?"
            id="secure"
            answer={`
              For six-digit passcodes specifically, there are a number of commonly used passcodes. Birthdays are also very common.

              An attacker would likely try these common patterns first, and there is chance that the random passcode generator actually gives you one of these common passcodes. 

              To prevent this, we prevent the generator from giving you a 6-digit passcode that is either:
              * On a list of the top 10,000 commonly used[^rockyou] 6-digit codes: \`123456\` or \`555555\` or \`789456\`
              * Or fits a common birthday format[^bday] (MMDDYY, DDMMYY, YYMMDD).

              This helps the entropy of your passcode be more trustworthy. You can see the full list of about [94,000 filtered passcodes here](https://github.com/blanchardjeremy/strongphrase.net/blob/main/src/scripts/wordlists/filtered_passcodes_six.js).

              We only do this filtering for 6-digit passcodes. Removing 94k from 10^6 possible passcodes is a very small fraction of the total, so you still have ~20 bits of entropy.

              [^rockyou]: Our list is derived from the [RockYou](https://en.wikipedia.org/wiki/RockYou) 2009 data breach that exposed 32 million passwords. These are sorted by how frequently they occurred in the leaked passwords. In our process, we filtered down to only 6-digit codes on that list. We then remove anything fitting our birthday formats (because we are going to re-add them separately). We then take the top 10,000.
              [^bday]: You can see this [heatmap for 4-digit pins](https://datagenetics.com/blog/september32012/index.html) for information on how birthdays and anniversaries are commonly used. 
            `}
          />

          

        </div>
      </section>
    </div>
  );
}

export default PasscodeFAQ;