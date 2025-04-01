import fs from "fs";
import moment from "moment";
const skipArray = [
  "github.com",
  "play.google.com",
  "apps.apple.com",
  "www.producthunt.com",
  "www.reddit.com",
  "www.quora.com",
  "www.tiktok.com",
  "www.youtube.com",
  "www.linkedin.com",
  "www.facebook.com",
  "www.instagram.com",
  "www.twitter.com",
];
const args = process.argv.slice(2);
function updateAI() {
  return fetch(args[0])
    .then((response) => response.json())
    .then((data) => {
      const tools = data.data.data;
      tools.map((tool: any) => {
        const {
          name,
          description,
          website,
          categories,
          image,
          handle,
          website_name,
        } = tool;
        const categoryNames = categories.map((category: any) => category.name);
        const now = moment();
        const websiteName = website
          .replace(/https?:\/\//, "")
          .split("/")[0]
          .split("?")[0];

        const websiteUrl = skipArray.includes(websiteName)
          ? website.split("?")[0]
          : `https://${websiteName}`;
        // wire file markdown
        const wireFile = `---\ntitle: ${website_name}\nname: ${name}\ndescription: ${description}\nwebsite: ${websiteUrl}\ncategories: ${categoryNames.join(
          ", "
        )}\nslug: ${handle}\ncreated_at: ${now.format(
          "HH:mm:ss MM/DD/YYYY"
        )}\n---\n\n\n`;
        // in folder data
        const wireFilePath = `data/${handle}.mdx`;
        fs.writeFile(wireFilePath, wireFile, (err: any) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File ${wireFilePath} created successfully!`);
        });
        //download image with name handle
        const imageUrl = image;
        const imagePath = `data/images/${handle}.jpg`;

        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            Bun.write(imagePath, blob).then(() => {
              console.log(`Image ${imagePath} downloaded successfully!`);
            });
          });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
updateAI();
