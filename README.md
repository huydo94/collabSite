# trill-tube

Trill-tube is a website that serves curated content from YouTube synchronously to all users, that is, when you and your friends tune in the website at the same time, you guys will see the same content playing (similar to watching the same channel on TV). And while doing that, everyone can chat and discuss the video being broadcasted. 

A working version of the site can be viewed here: http://ec2-13-58-83-204.us-east-2.compute.amazonaws.com:3000

The website is under development. To run the site on your local computer, first install Meteor: 

```
curl https://install.meteor.com/ | sh
```

then clone this repo:

```
git clone https://github.com/huydo94/trill-tube.git
```

```
cd trill-tube
meteor remove blaze-html-templates
meteor add angular-templates
meteor npm install --save angular angular-meteor
```

Then hit 
```
meteor
``` 

to run the app. Go to your browser (preferable Chrome) and enter localhost:3000 to view the site. 




