const list = document.getElementById('list');
//loop trough the rpcs folder 
fs.readdir('./rpcs', (err, files) => {
    if(err) console.error(err);
    files.forEach(file => {
        //read the file
        fs.readFile('./rpcs/'+file, 'utf8', (err, data) => {
            if(err) console.error(err);
            //parse the file
            data = JSON.parse(data);

            const li = document.createElement('li');
            const button = document.createElement('button');
            button.innerHTML = data.name;
            button.ondblclick = () => {
                select(file);
            }
            li.id = file;
            li.appendChild(button);
            list.appendChild(li);
        });
    })
});