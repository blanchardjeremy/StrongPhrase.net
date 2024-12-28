import React from 'react';
import { getWordStats, getSampleWords, avgTimeToCrackFormatted, getPrimaryGrammarLabels } from './passphraseUtils';
import { entropyPerCharData } from './entropy_per_char_data.js';
import FAQItem from './FAQItem';

import './PassphraseFAQ.css';


const WordStatsFAQItem = () => {

  function dictToMarkdownTable(wordCounts) {
    // Start with the table header
    let markdownTable = "| Category | # of Words | Bits of entropy | Samples |\n";
    markdownTable += "|----------|-------|----------|--------|\n";
    
    // Iterate through the dictionary and append each key-value pair as a table row
    for (const key in wordCounts) {
      const samples = '`' + getSampleWords(key).join('` `') + '`';
      const entropy = Math.floor(Math.log2(wordCounts[key])); 
      markdownTable += `| **${key}** | ${Intl.NumberFormat().format(Number(wordCounts[key]))} | ${entropy} | ${samples} \n`;
    }
  
    return markdownTable;
  }


  const wordStats = getWordStats();
  const wordStatsTable = dictToMarkdownTable(wordStats);

  return (
    <FAQItem 
        question="What word lists are you drawing from?" 
        id="words"
        answer={`
${wordStatsTable}

They were chosen to be common enough words that they would be easy to remember and type. You can find the [full list of words here](https://github.com/blanchardjeremy/strongphrase.net/blob/main/src/words.js).
The numbers were chosen to be somewhat easy to remember (rather than fully random).

I put some time in filtering out offensive words, but I'm sure I missed some. If you find words that you think should be removed, [I'd love to hear the feedback](https://forms.gle/pu1vqi8Mc1VYirGz6).
        `} 
      />
  );
}

const EntropyPerCharTable = () => {
  // Function to convert the data to a markdown table
  const convertToMarkdownTable = (data) => {
    const labels = getPrimaryGrammarLabels();

    let markdown = `| Passphrase System | Avg Entropy<br/>Bits/Char | Sample |\n`;
    markdown += `|------|-----|--------|\n`;

    Object.entries(labels).forEach(([key, label]) => {
      if (data[key]) {
        const { avg, sample } = data[key];
        const sampleText = sample ? ` \`${sample}\`` : "";
        markdown += `| StrongPhrase (${key} bits)  | **${avg}** | ${sampleText} |\n`;
      }
    });

    markdown += `| Original Diceware | **3.0** | \`nr x's jive ev flock\` |\n`;
    markdown += `| [EFF Diceware (Long)](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases) | **1.8** | \`halves croak magazine sappy never\` |\n`;
    markdown += `| [EFF Diceware (Short)](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases) | **2.3** | \`bust boil sheep pest scorn\` |\n`;
    markdown += `| [Orchard Street Wordlist (Long)](https://github.com/sts10/orchard-street-wordlists?tab=readme-ov-file#orchard-street-long-list) | **1.77** | \`plank billionaire evaluated punched proficiency\` |\n`;
    markdown += `| [Orchard Street Wordlist (Medium)](https://github.com/sts10/orchard-street-wordlists?tab=readme-ov-file#orchard-street-medium-list) | **1.83** | \`adding pilots maximal website opponent\` |\n`;
    markdown += `| [Orchard Street Wordlist (Smart TV)](https://github.com/sts10/orchard-street-wordlists?tab=readme-ov-file#orchard-street-alpha-list) | **2.51** | \`deity jazz cad bay beg lest\` |\n`;
    markdown += `| Random (all lower) | **4.70** | \`bddacsvxmh\` |\n`;
    markdown += `| Random (w/ num and symbols) | **6.13** | \`N7qm!C#9A@\` |\n`;

    return markdown;
  };

  const entropyPerCharMarkdownTable = convertToMarkdownTable(entropyPerCharData);

  return (
    <FAQItem 
        question="Why are these passphrases so long? I keep making typos!" 
        id="words"
        answer={`
The biggest downside to passphrases like this is that you're more likely to have typos given how long the phrase is!

One way we can measure the "efficiency" of a passphrase is to calculate the entropy per character. 
For example, \`bored pupil picks out five-star softball\` contains 40 character (including spaces) and has 44 bits of entropy.
So 44/40 = **1.1 bits of entropy per character**. 

A fully random password with lower, upper, numers, and symbols like \`N7qm!C#9A@\` has log<sub>2</sub>(70) = **6.13 bits per character**.
These are much higher entropy, but as we've discussed, they're very difficult to remember.

Compared to other passphrase schemes, StrongPhrase.net passphrases have less entropy per character. 
Which means you need a longer passphrase to get the same amount of entropy. Which means you're somewhat more likely to get a typo.

Here is a table for comparison of the entropy per character for different passphrase systems: 

${entropyPerCharMarkdownTable}

The EFF word lists are much more efficient (higher entropy per character) than our system. So if you want to reduce typing errors, their system provides an advantage.

The original Diceware list has some very short words that makes them more efficient, but the words are often very odd and therefore hard to remember (examples: nr, ev, zzz, $$, 28th).
        `}
      />
  );
};


const PassphraseFAQ = () => {
  return (
    <div className="faq-all">
      <section className="content faq-overall-container markdown-content" id="FAQ">
        <h1 className="section-header">Frequently Asked Questions</h1>

        <div className="faq-container">
          <FAQItem 
            question="What is this tool? How does it help me?"
            id="intro"
            answer={`
              Use this site to create strong passphrases that are easy to remember.
              These passphrases are **much stronger** than most passwords because they are randomly generated, whereas passwords are often reused, shorter, and easier to guess.
              This site was inspired by other passphrase generates like [diceware](https://www.eff.org/dice), but designed to generate phrases that are **easier to visualize and remember**.

              If you're not sold on passphrases over passwords yet, maybe [Edward Snowden can convince you](https://youtu.be/yzGzB-yYKcc) 😂.
            `} 
          />

          <FAQItem 
            question="Should I choose STRONG, STRONGER, or STRONGEST?" 
            id="choosing"
            answer={`
              The best answer for most folks is: choose any passphrase that you will use. That's probably the easiest one ("**STRONG**"). Password advice is only helpful if you use it. So while the "**STRONGEST**" option is harder to crack, it is also harder to type every time. For most folks, the "**STRONG**" is plenty.
              
              The longer answer is: It depends on how important the data is you're trying to protect. 
              If you follow the approach recommended above, you're primarily using these passphrase to secure your password manager and laptop. 
              Hacking either of those requires physical access to your device. So the question becomes: 
              **"How likely is it that someone will get access to my device? And how much time/money would they be willing to put into cracking it?"**
              
              For most of us, "STRONG" is plenty. But if you are securing extremely valuable information, you can try one of the stronger formats. (You can also use the "Show all formats" to see a number of other structures that are available at different strength levels.)

              If you want to geek out more, you can check out the [time/cost to crack table](/#/table) for more details and read the FAQ answers about time and cost to crack below.
            `} 
          />

          <FAQItem 
            question="How does this compare with other password schemes?"
            id="compare"
            answer={`
              | Password scheme                     | Example                               | Strength     | Easy to remember<br> and type |
              |-------------------------------------|---------------------------------------|--------------|-------------------------------|
              | Common word/name/etc                | \`dragon\`                            | ❌ Weak       | ✅ Easy                        |
              | Common word <br>with substitutions  | \`dr@g0n123!\`                        | ❌ Weak       | ❌ Hard                        |
              | Random characters                   | \`N7qm!C#9A@\`                        | ✅ Strong     | ❌ Hard                        |
              | Diceware passphrase                 | \`wrangle matter esquire granny\`     | ✅ Strong     | ⚠️ Kinda easy                  |
              | **StrongPhrase.net<br> passphrase** | **\`evil juror obtains thin moths\`** | ✅ **Strong** | ✅ **Easy**                    |
            `} 
          />

          
          <FAQItem 
            question="Wait, is it safe to generate a passphrase from a website?" 
            id="safe"
            answer={`
              Yes (relatively). This website runs entirely on your browser. There's no server that generates the passphrase. You can turn off your wifi and the site will still work!
              For the extra paranoid, you can generate a "[diceware](https://www.eff.org/dice)" passphrase entirely offline.
            `} 
          />

          
        </div>
      </section>


      <section className="content faq-overall-container markdown-content" id="FAQ">
        <h1 className="section-header">🤓🤓 Technical Background 🤓🤓</h1>
        <div className="faq-container">
          <FAQItem 
            question="What makes a strong password? (hint: entropy!)"
            id="entropy"
            answer={`
              **Entropy** is a technical term that refers to how hard a password is to crack.

              A 10-character password word made up of lowercase letters (26 characters) forms 26<sup>10</sup> = 141,167,095,653,376 (144 trillion) possible different combinations. It's cumbersome to write numbers that long, so we instead write it use exponents like "2 to the power of X" (2<sup>X</sup>). In our exmaple, 26<sup>10</sup> is about equal to **2<sup>47</sup>**. So we say this password has **"47 bits of entropy"**.
              
              Some examples: 

              | Type                                 | Pool of<br>characters | Example        | Entropy for a <br>10-character password |
              |--------------------------------------|-----------------|----------------|-----------------------------------------|
              | Lower                                | 26              | \`bddacsvxmh\` | log<sub>2</sub>(26)*10 = **47 bits**    |
              | Lower + upper                        | 52              | \`cExNefEMVI\` | log<sub>2</sub>(52)*10 = **57 bits**    |
              | Lower + upper + num + common symbols | 70              | \`N7qm!C#9A@\` | log<sub>2</sub>(70)*10 = **61 bits**    |

              But most people don't use 10-character passwords. They use common words that can be easily found on a wordlist. Or they turn \`dragon\` into something harder like \`dr@g0n123!\`. That's an improvement, but since most attackers will be using a [dictionary of common words/names/passwords](https://github.com/kkrypt0nn/wordlists?tab=readme-ov-file), and will know to expect [obvious subtituations](https://blanchardjeremy.github.io/tryzxcvbn/), it doesn't help as much as we might hope.

              This [classic xkcd comic](https://xkcd.com/936/) about passwords vs passphrases is a good summary.

              <div class="text-center">
                <img src="https://imgs.xkcd.com/comics/password_strength_2x.png" alt="xkcd comic about passphrases vs password" width="700" class="mx-auto" />
              </div>

              | Password          | Attack approach                                     | Bits of entropy          | Avg time to crack <br>(3 million guesses/sec) |
              |-------------------|-----------------------------------------------------|--------------------------|-----------------------------------------------|
              | \`dragon\`        | Top 100 passwords                                   | = **7 bits**                   | Instatnly                                     |
              | \`dr@g0n\`        | + Common substitutions  (10 options)                | 7+3+3 <br>= **13 bits**          | Instantly                                     |
              | \`dr@g0n1998$!#\` | + Year (2,000 options) + symbol at end (30 options) | 7+3+3+11+5+5+5 <br>= **34 bits** | 1 day                                       |
              | \`socrates\`      | Common names (20,000) | = **14 bits** | Instantly                                       |
              | \`socrates*^$cacatus\`| Common names (20,000) + symbols <br>+ Common words (20,000) | 14+3+3+3+14 <br>= **37 bits** | 7 hours                                       |

              We can achieve much more human-friendly passphrases by using something like [diceware](https://www.eff.org/dice). Diceware draws from a list of **7,776 words**. So a phrase with 3 words has 7,776<sup>3</sup> = 479 trillion possible combinations. Each word adds 12.9 bits of entropy.
              
              | Diceware passphrase                                     | Bits of entropy | Avg time to crack <br>(3 million guesses/sec) |
              |---------------------------------------------------------|-----------------|-----------------------------------------------|
              | 3 words: \`shading deflected panorama\`                 | **39 bits**     | ${avgTimeToCrackFormatted(39, 3e6)}           |
              | 4 words: \`wrangle matter esquire granny\`              | **52 bits**     | ${avgTimeToCrackFormatted(52, 3e6)}           |
              | 5 words: \`dyslexia glitter repossess glimpse unrobed\` | **65 bits**     | ${avgTimeToCrackFormatted(65, 3e6)}           |

              The passphrases we generate on this site offer similar strength, but are easier to visualize and therefore easier to remember.

              | **StrongPhrase.net passphrase**                                              | Bits of entropy | Avg time to crack <br>(3 million guesses/sec) |
              |------------------------------------------------------------------------------|-----------------|-----------------------------------------------|
              | Strong: \`evil juror obtains thin moths\`                                    | **44 bits**     | ${avgTimeToCrackFormatted(40, 3e6)}           |
              | Stronger: \`drunk niece and greedy goose clean tall book\`                   | **58 bits**     | ${avgTimeToCrackFormatted(58, 3e6)}           |
              | Strongst: \`emotional boxer and concerned virus acquire 45 smashed baskets\` | **66 bits**     | ${avgTimeToCrackFormatted(66, 3e6)}           |

              Check out our **[entropy and time/cost to crack table](/#/table)** for more examples.
            `} 
          />

          <FAQItem
            question="How much entropy is enough?"
            id="enoughentropoy"
            answer={`
              If you take a look athe  **[time/cost to crack table](/#/table)**, you can make an assessment for yourself. 

              My two cents is that **45 bits** is sufficient for most situations, and that **65 or 70 bits** is more then enough for even very high security situations.

              An example of a high-security choice is [SecureDrop](https://securedrop.org/), a tool for whitleblowers to share files anonymous with journalists. 
              Each submitter is given a 7-word diceware passphrase in order to continue communication with the journalist in the future. 7 diceware words = 13 bits/word * 7 words = **90 bits of entropy**.
            `}
          />


          <FAQItem
            question="But how would the attacker know I used this passphrase system?"
            id="system"
            answer={`
            In reality, they probably wouldn't know. 
            All of these examples assume that an attacker knows which passphrase scheme you've chosen and the exact wordlists used. So really we are listing the "minimum entropy" because that's the safest guess.
            
            But in reality, an attacker is more likely to try a lot of other approaches before trying this scheme. They will likely try [common word lists](https://github.com/kkrypt0nn/wordlists), and lots of variations on common word lists (replacing the letter i with the number 1, adding numebrs and symbmols to the beginning and end, etc.). 
            Then perhaps they might try a lot of diceware combinations (3 words, 4 words, etc.). 
            Then if they knew this system exists, they might try it. Even then, they'd have to know which of the 3 main formats you chose. 
            If they don't know this exact system exists, they would resort to a pure brute force at some point where they try every combination.
            
            All of those other approaches being tested first means you get the equivalent of another at least 20 bits of extra entropy (and probably a lot more). 
            (Your password itself doesn't truly have more entropy in it, but the attacker would have to go through a large number of possiblel guesses before event starting to guess passphrases like yours.)
            `}
          />

          <WordStatsFAQItem />

          <FAQItem 
            question="How do you calculate the TIME to crack a passphrase?" 
            id="time"
            answer={`
              This is tricky. It requires making a lot of assumptions about how strong the "hash" of the password is and the computing power of the attacker. 

              Estimating the number guesses/second (aka: hashes/second) is challenging because the functions used to "hash" a password vary widely, meaning it can take more/less time to check if the password is computer.

              We could go with what Edward Snowden told us in 2014: [Assume your adversary is capable of a trillion guesses per second](https://www.nytimes.com/2013/08/18/magazine/laura-poitras-snowden.html). This applies to the NSA or other "nation state" attacker.
              A lot has changed since then both in terms of computing power (which has gone up) and also in terms of complexity of password hashing algorithms (which have made it harder for an attacker to guess).
              Our "nation state" profile (below) ends up being quite similar (1.9 trillion guesses/second).

              In an effort to think through this problem step-by-step (and offer "consumer" attack situations), we'll use the great great [password strength table maintined by Hive Systems](https://www.hivesystems.com/blog/are-your-passwords-in-the-green) which shows the time it would take to crack various kinds of passwords. 
              We'll use the same assumptions they used, since they put so much thought into their work.

              Assumptions:
              * The attacker has access to your hashed password. Either they broke into a database or have access to your physical machine.
              * That password was hashed with bcrypt (at a [work factor](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#using-work-factors) of 32). 
                (Systems like 1Password and MacOS use a hashing approach that [much stronger](https://support.1password.com/pbkdf2/), so the guesses/second would be much lower than what you see below.)
              * The data below is current as of 2024 and will need updated as the cost of computing power continues to decrease.

              We provide profiles for 3 different levels of computing power:

              |                                | Standard consumer hardware    | Best consumer hardware (default)                                        | Nation state (NSA, etc.)      |
              |--------------------------------|-------------------------------|-------------------------------------------------------------------------|-------------------------------|
              | **Hardware**                   | RTX 4090 (single GPU)         | RTX 4090 with 10 GPUs <br>(≈ Cloud-based A100 with 16 GPUs)[^cloudA100] | A100 with 10,000 GPUs         |
              | **Est. Cost**                  | $2,300                        | $23,000 or <br>$64/hour for 2 AWS instances[^aws]                       | $410,000/hour                 |
              | **Crack time for 8 chars**[^1] | 99 years                      | 7 years                                                                 | 5 minutes                     |
              | **Calculation**                | = 70^8 / (99\\*365\\*24*3600) | = 70^8 / (7\\*365\\*24*3600)                                            | = 70^8 / (5*60)               |
              | **Guesses/second**             | = **184,000 guesses/sec**             | = **2.6 million guesses/sec**                                   | = **1.9 trillion guesses/sec**        |


              [^1]: Crack time is based on [hivesystems.com's table](https://www.hivesystems.com/blog/are-your-passwords-in-the-green) for a password with 8 characters using lowercase, uppercase, symbols, and numbers (70 characters in the pool).
              [^aws]: AWS pricing is based on the [Amazon EC2 P4d](https://aws.amazon.com/ec2/instance-types/p4/) for EC2 P4d.24xlarge instances.
              [^clouda100]: [Hivesystems.com's table](https://www.hivesystems.com/blog/are-your-passwords-in-the-green) lists "17 years" to crack our standard password using an A100 x8, so A100 x16 should be about 8 years, which is close enough to the "7 years" listed for RTX 4090. 

              The "**Far future  nation state**" profile is a wild guess at what might be possible far in the future.

              When we display "average time to crack" it takes the "max time to crack" and divides by two. 
              It may take an attacker way less time or way more time. 
              But on average, they will need to search through half the possible combinations to find your key.

              `} 
            />

          <FAQItem 
          question="How do you calculate the COST to crack a passphrase?" 
          id="cost"
          answer={`
            The downside to "time to crack" is that we have to make guesses about the computing power an attacker is using. 
            If it takes 500 hours to crack a certain password with 1 process, an attacker could rent 500 cloud processors and crack the same password in 1 hour.
            The question becomes "how much money would that cost?"

            If we can find a reasonable guess at the cost to crack regardless of hardware, we can have a better sense of how well protected a passphrase is.
            Thankfully, we can draw from [Jacob Enger's Money-to-Crack research](https://jacobegner.blogspot.com/2020/11/password-strength-in-dollars.html).

            |                                                                                                      | Guesses/second | Guesses/$           | $ per 2<sup>32</sup> guesses[^convert] |
            |------------------------------------------------------------------------------------------------------|----------------|---------------------|----------------------------------------|
            | **AWS A100 using 10,000 GPUs**<br>(Hash: bcrypt)<br>*(based on hivesystems.com)*                     | 2.6 trillion   | 17 billion [^conv2] | $0.25                                  |
            | **RTX 4090 using a single GPU**<br>(Hash: bcrypt) <br>*(best case)*                                         | 184,000        | 9.3 billion         | $0.56                                  |
            | **1Password's cracking competition average**[^1p] <br> (Hash: PBKDF2)<br>*(much harder than bcrypt)* | *[???]*        | 715 million         | $6                                     |
            | **Estimated average we use**                                                                         | —              | **8.6 million**     | **$0.50**                              |

            [^convert]: The formala to convert from guesses/dollar to dollars per 2^32 guesses is: **(2^32) / (guesses/second)**
            [^conv2]: The formula here is **(guesses/second * 3600) / ($/hour)** so here we have: **(1.9 trillion * 3600) / $410,000 = 17 billion**.
            [^1p]: Details can be found on the blog post about the [1Password cracking competition](https://blog.1password.com/cracking-challenge-update/).

            We choose **$0.50 per 2<sup>32</sup> guesses** as our figure because we it's fairly conservative. 
            1Password has a much higher cost to crack than our assumption (bcrypt) because they have a more computationally-intense hashing function.

            If you want to play with different "cost to crack" scenarios, you can use our [Cost to Crack Table](/#/table).

            The powerful GPUs that help an attacker crack passwords are the same GPUs that are used to train AI models. 
            As AI continues to explore, it's reasonable to assume that these GPUs will become ever more available on the cloud.
          `} 
          />

          <EntropyPerCharTable />


          <FAQItem 
            question="Other resources" 
            id="resources"
            answer={`
              Here are some resources that I've found helpful in exploring passwords:

              
              * [How long does it take to crack a password? - HiveSystems.com](https://www.hivesystems.com/blog/are-your-passwords-in-the-green)
              * [How to create a strong master password - 1Password](https://blog.1password.com/toward-better-master-passwords/)
              * [Cost to crack competiation - 1Password](https://blog.1password.com/cracking-challenge-update/) and the [write ups from the winners](https://github.com/agilebits/crackme?tab=readme-ov-file#contest-status). Also their [2020 PasswordsCon slides about the competiation](https://github.com/agilebits/crackme/blob/master/doc/PasswordsCon2020.pdf).
              * [Money-to-Crack model - Jacob Enger](https://jacobegner.blogspot.com/2020/11/password-strength-in-dollars.html)
              * [Choosing a password manager](https://freedom.press/training/choosing-a-password-manager/)
              * [Password entropy calculator](https://blanchardjeremy.github.io/tryzxcvbn/) - These password strengths checkers are never able to be fully accurate, because an attacker might know the system you're using, but this strengther check might assume it's totally random. That said, it can be helpful in learning to think the way password crackers think. I updated this tool to display bits of entropy using log2 instead of log10.
              * [EFF updated the original diceware wordslists](https://www.eff.org/dice) and created [fandom wordlists](https://www.eff.org/deeplinks/2018/08/dragon-con-diceware). Also see the [deep dive](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases) on how they designed this.
              * [Orchard Street wordlists](https://github.com/sts10/orchard-street-wordlists) including options for [wordlists that are great for use with Smart TVs](https://github.com/sts10/orchard-street-wordlists?tab=readme-ov-file#orchard-street-alpha-list)
              * [Diceware online generator](https://diceware.rempe.us/#eff)
              * [Hashcat hashes/second benchmarks](https://openbenchmarking.org/test/pts/hashcat)
            `} 
          />

        </div>
      </section>
    </div>
  );
};

export default PassphraseFAQ;
