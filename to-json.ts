import fs from "fs";
// get files in folder data
import path from "path";
fs.readdir(path.join(process.cwd(), "data"), (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  // filter files with .mdx
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
  // create json file
  const jsonFile = mdxFiles.map((file) => {
    const filePath = path.join(process.cwd(), "data", file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const [frontmatter] = fileContent.split("---").slice(1, 2);
    const frontmatterLines = frontmatter.split("\n").filter(Boolean);
    const frontmatterObject: any = {};
    frontmatterLines.forEach((line) => {
      const [key, value] = line.split(": ");
      if (!key || !value) return;
      frontmatterObject[key.trim()] = value.trim();
    });
    return frontmatterObject;
  });
  // write json file
  fs.writeFile(
    path.join(process.cwd(), "data-ai.json"),
    JSON.stringify(jsonFile, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("JSON file created successfully!");
    }
  );
});
