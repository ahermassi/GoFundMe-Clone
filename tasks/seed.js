const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const projects = data.projects;
const passwordHash = require('password-hash');

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

   let akeem_pwd = passwordHash.generate('akeem'),
   stephanie_pwd = passwordHash.generate('stephanie'),
   peter_pwd = passwordHash.generate('peter'),
   jane_pwd = passwordHash.generate('jane'),
   michalene_pwd = passwordHash.generate('michalene'),
   chris_pwd = passwordHash.generate('chris'),
   joanna_pwd = passwordHash.generate('joanna'),
   ben_pwd = passwordHash.generate('ben'),
   jon_pwd = passwordHash.generate('jon'),
   jacquie_pwd = passwordHash.generate('jacquie');

    let akeem, stephanie, peter, jane, michalene, chris, joanna, ben, jon, jacquie;
    try {
        akeem = await users.addUser('Akeem', 'Baker','akeem@gmail.com', akeem_pwd,
            'Brunswick','GA');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        stephanie = await users.addUser('Stephanie', 'Garfield','stephanie@gmail.com', stephanie_pwd,
            'Los Altos','CA');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        peter = await users.addUser('Peter', 'Ramsammy','peter@gmail.com', peter_pwd,
            'New Haven','CT');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        jane = await users.addUser('Jane', 'Komori','jane@gmail.com', jane_pwd,
            'Santa Cruz','CT');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        michalene = await users.addUser('Michalene', 'Stoming','michalene@gmail.com', michalene_pwd,
            'Chicago','IL');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        chris = await users.addUser('Chris', 'Poole','chris@gmail.com', chris_pwd,
            'Tampa','FL');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        joanna = await users.addUser('Joanna', 'Crane','joanna@gmail.com', joanna_pwd,
            'Versailles','KY');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        ben = await users.addUser('Ben', 'Wei','ben@gmail.com', ben_pwd,
            'New York','NY');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        jon = await users.addUser('Jon', 'Norton','jon@gmail.com', jon_pwd,
            'Fairfax','VA');
    } catch (e) {
        console.log(e.toString());
    }
    try {
        jacquie = await users.addUser('Jacquie', 'Missy','jacquie@gmail.com', jacquie_pwd,
            'Birmingham','MI');
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('I Run With Maud', 'other', akeem._id,
            new Date(2020, 4, 4, 9, 22), 100000,
            "This fundraiser was designed to assist Ahmaud's family.  Ahmaud was my best friend so I want " +
            "to do everything possible to bring honor to his name and make sure justice is served. ALL donations are going " +
            "towards the fight for making sure justice is served and to ensure that Ahmaud's family has the resources they " +
            "need for the sole purpose of the case.  Having to grieve and deal with getting justice, are already two major " +
            "burdens.  The goal is to help lighten the load by eliminating the financial burden as much as possible. " +
            "Please continue to share Ahmaud's story until justice is served for those responsible for his death. Any " +
            "donations will be MORE than appreciated by Ahmaud's family.", 0, [],
            [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Gregg Garfield Covid 19 Patient Zero', 'medical', stephanie._id,
            new Date(2020, 3, 26, 14, 22), 50000,
            "When my brother Gregg left on Feb. 20 for his annual boys' ski trip adventure, he had no idea " +
            "10 days later he would begin his most difficult journey to date- fighting for his life.  On March 5, 2020 " +
            "Gregg checked himself into St. Joseph's Providence Hospital Burbank with serious Covid-19 symptoms.  He was " +
            "the hospital's first Covid-19 patient, or \"Patient Zero\" as they call him.  Two days later, under heavy " +
            "sedation and paralytic drugs, the doctors intubated him- around day 10 doing a tracheostomy- and he continued " +
            "to be on a ventilator for 31 days.    During that time his body became septic; his kidneys failed and he was " +
            "put on CRRT dialysis; his blood pressure plummeted and he needed medications to divert his blood-flow to his " +
            "major organs for survival, leaving his hands and feet starving for circulation; he spiked fevers and was " +
            "covered in ice; his lungs collapsed 4 times and chest tubes were inserted; and he developed secondary " +
            "infections that are common in hospital environments.  He had a 1% chance of surviving. ", 0,
            [], [], true);
    } catch (e) {
        console.log(e.toString());
    }


    try {
        await projects.addProject('Help Travis beat Brain Cancer again!','medical',peter._id,
            new Date(2020,3,28,16,16),650000,
            "On March 27th 2020 Travis Ramsammy, my brother was diagnosed as having an aggressive cancerous " +
            "tumour near his brain called undifferentiated pleomorphic sarcoma. For the second time in his life this " +
            "strong 22 year old finds himself preparing to fight cancer once again, a feat he accomplished 16 years ago at " +
            "the age of 5 . But now, more than ever,he needs your help to win this battle.\n" +
            "The Ramsammy family would like to thank you for showing an interest in our case and we humbly ask for any help " +
            "you can spare to raise enough funds to make Travis’ treatment a success.\n" +
            "We are a family of five from Trinidad and Tobago. My parents and their three sons the eldest being me, Peter, " +
            "the younger is Chad and youngest but strongest is Travis. I am writing on behalf of Travis who needs your " +
            "urgent attention and help.This is Travis’ story.",0,[], [],true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Support Fund for Striking Workers at UCSC!!','education', jane._id,
            new Date(2019,11,9,16,16),300000,
            "On Sunday, Dec 8 2019, UCSC graduate student workers voted for an unauthorized wildcat strike, " +
            "effectively immediately. Workers will be withholding final grades until administration meets demands for a " +
            "Cost of Living Adjustment (COLA), amounting to a $1,412 increase per month to all graduate students, " +
            "regardless of residence, visa, documentation, employment, or funding status. " +
            "\nThe UCSC chancellor makes over $400,000 a year [1] AND receives a $6,500 housing stipend per month, meanwhile " +
            "graduate students have to live in one of the most expensive cities in the country [2] on less than $25k a year. " +
            "\nLend your support to striking grad students as they organize for better conditions for educators, students, " +
            "and workers everywhere!" +
            "\nNO COLA, NO GRADES! SOLIDARITY FOREVER!",0,[], [],true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Scott Kell\'s Kids College Fund','education', michalene._id,
            new Date(2020,0,21,16,34),200000,
            "Scott Kell, was a devoted, kick-ass father who expected to have a lot more time to spend with " +
            "his wife, Michalene Kell, and children.  They valued education and learning, and they were more than thrilled " +
            "when their son Keegan followed in his parents' footsteps to attend Purdue University, where he is a freshman. " +
            "(There's little doubt Scott and Michalene hoped Maggie would be also going to to a stellar University in a couple years)."+
            "\nSadly, Scott wont get to see that happen.  But maybe we can help their dream come true.  Given his untimely " +
            "passing, let's ease the family's stress and honor Scott's memory by contributing to this fund, 100% of which " +
            "will go to help underwrite the educational costs for Scott's two children.",0,
            [], [],true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Chris Poole Legal Defense Fund','animals', chris._id,
            new Date(2020,2,6,9,19), 100000,
            "It's not fair to ask anyone for more support than you've already given us since we began " +
            "making and sharing our beloved cats back in 2012. First and foremost, everyone human and feline, is currently " +
            "healthy, no worries there. However, without that gracious support you’ve blessed us with, we are at risk of " +
            "losing everything we've ALL built together. You stood by our side when Marmalade had cancer in 2014 and we’ve " +
            "shared in his joyous remission since. When Chris needed a shed last year to house TNR cats before being " +
            "released, an Amazon Wishlist from you all fulfilled that dream. Dozens of cats have since then spent time in " +
            "the “catty shack” after their lives were saved by him. More than 8,000 cans of cat food were gifted from you " +
            "to Chris for his birthday; all to feed feral colony cats and fosters! You've shared, commented, voted, loved, " +
            "anxiously awaited test results, cried and laughed with us all for years. The messages we received on social " +
            "media and in person, about being a light in the darkness when all else seems hopeless, saved us as much as it " +
            "hopefully saved you.",0,[], [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Clovis Crane Barn Fire Rebuild Fund','animals', joanna._id,
            new Date(2020,2,7,9,19), 100000,
            "Our friend Clovis Crane suffered a horrific barn fire on March 7th, leaving 15 animals " +
            "perished in their stalls. Now is a moment of need, let's pull together to help Clovis and his family rebuild " +
            "what this fire took from them. When the horse industry puts our shoulders to something we can make big " +
            "things happen.",0,[], [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('A Million Masks: Coronavirus Support Fund','community', ben._id,
            new Date(2020,2,19,12,19), 750000,
            "Right now, in New York City, many hospitals have already run out of supplies for its frontline " +
            "healthcare workers — the doctors, nurses & healthcare staff who are treating COVID-19 patients. Some have told " +
            "us that they are most likely sick with COVID-19, but there aren’t enough tests for them to get a definitive " +
            "answer. Now, they’re telling us they're wearing the same mask for four days. \nAs New Yorkers, we couldn't just " +
            "sit around and watch — we’re fighters. \nWe began to speak with medical professionals and hospital " +
            "administrators and have identified that their greatest needs are masks — it’s their first line of defense when " +
            "dealing directly with COVID-19 patients. ",0,[], [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Great American Restaurants Employee Relief Fund','community', jon._id,
            new Date(2020,2,21,12,19), 800000,
            "Recently Great American Restaurants has had to face unimaginable challenges with more " +
            "uncertain times ahead during this national health crisis. During this time of uncertainty, many of our guests, " +
            "friends and neighbors have asked what they can do to help financially support the 1,700 GARStars we had to " +
            "make the difficult decision to lay off due to the pandemic that has drastically impacted our industry. " +
            "We are beyond appreciative and blown away by this outpouring of love and support. \nWe have set up the Great " +
            "American Restaurants Employee Relief Fund to help support these 1,700 wonderful people. The Norton family will" +
            " match every contribution two for one. That means that if you donate $100, the Norton family will add $200 to " +
            "the Relief Fund. Every contribution counts - no matter how small - it will make a profound impact in the lives " +
            "of these outstanding people. Your continued support during this difficult time means more to us than you will " +
            "ever know. ",0,[], [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Support Community Yoga Studio','sports', jacquie._id,
            new Date(2019,11,20,16,19), 100000,
            "Our inspiration and pursuit of opening this studio is because of each of you and the integral " +
            "part you play in the connected whole. It’s why we’ve chosen the word Community to call the studio. This word " +
            "embodies why we show up day after day, year after year. This word often times turns an ordinary hour into " +
            "something incredibly extraordinary. \nSo many of you have reached out asking what can you do to help. Given " +
            "the very tight timeline we are working with to maintain your continuity of practice, we are announcing a " +
            "FOUNDING MEMBER program that will allow you to show your support. We are providing a once-in-a lifetime " +
            "limited opportunity to be a Founding Member of CY.",0,[], [],
            true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Jameson\'s "Make-A-Wish"','travel', chris._id,
            new Date(2019,10,22,15,15), 15000,
            "As many of you know, Jameson has been in a raging battle with the flu and pneumonia. What " +
            "we know at this moment is that Jameson is fighting complications from the flu type B, pneumonia, and a " +
            "staph infection. It has attacked his lungs and significantly impacted his ability to breathe. He is in " +
            "somewhat stable, but critical condition on a ventilator in the ICU at UMASS in Worcester. He has been " +
            "hospitalized for eight days now. The ventilator is not doing 100% of the work; it is supplementing what " +
            "Jameson is able to do on his own. He is fighting with everything he has! Early attempts to wean him " +
            "slightly from the ventilator have shown that he is not quite ready yet. He is comfortably sedated and " +
            "listening to his favorite tunes in the background. Jameson takes little steps forward and little steps " +
            "back with each passing hour. The main focus now is to keep Jameson comfortable and stable, not working " +
            "too hard to breathe, monitoring his lungs with periodic x-rays, identifying any and all infections & " +
            "treating them accordingly. ",0,[], [],
            true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Helping employees at Alpine Worldwide','travel', akeem._id,
            new Date(2020,3,7,7,7), 50000,
            "The last few weeks have been a crazy, difficult, and scary time for all of us. Alpine " +
            "Worldwide has been very busy trying to adjust to the \"new normal.\"\nAs always, we are excited and happy " +
            "to meet the continued needs of our customers but at this time where travel is limited, we need your " +
            "support and help. As you know, Alpine Worldwide is a family business and we would like to continue to " +
            "support our family. The funds that we may acquire from this platform will go towards supporting our staff " +
            "during this difficult time. We would like to continue to support our staff so that when this is all over " +
            "and travel resumes, we will be there for you, our customers.",0,[],
            [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Burnell Cotlon\'s Lower 9th Market','business', joanna._id,
            new Date(2020,3,6,17,27), 400000,
            "This store serves the very under served 9th Ward. It is even more important now as the " +
            "Virus is decimating the area.  Any contribution will be well utilized.",0,[],
            [], true);
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.addProject('Country House Community Outreach','volunteer', stephanie._id,
            new Date(2020,2,18,18,18), 20000,
            "We are raising money to continue to serve our community at the highest level!  Due to the " +
            "overwhelming support as of Apri 1st we are currently serving over 2,300 meals per day at 4 separate " +
            "locations. Still with a focus on delivering to seniors during this crisis we are now also committed to " +
            "Veterans, First responders, frontline health workers and children as well as families.  We want to keep " +
            "our employees active, and help them feed their families.  The positive demand has been incredible! Our " +
            "initial plan to 100% self fund is not doable if we want to reach more families (thousands more per day)--" +
            "but we will continue to absorb any costs we can.  None of these funds will be used in any type of profit " +
            "mode or monies to ownership.  It will all be used for feeding those in need! As we plan on expanding these " +
            "services through our network of schools we will need additional resources.  We want to continue getting as " +
            "many meals to as many families in need but we need your help.  Please consider donating anything to this " +
            "wonderful cause.  $1, $5, anything will help.  Our lone goal during this extremely difficult time is to " +
            "provide the community with a hot, healthy meal.  Thank you and fight on!",0,[],
            [], true);
    } catch (e) {
        console.log(e.toString());
    }

    console.log('Done seeding database');
	await db.serverConfig.close();
}

main().catch((error) => {
	console.error(error);
});