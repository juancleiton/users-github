import api from './api';

class App{
    constructor(){
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.divSearchEl = document.getElementById('box-search');
        this.listEl = document.getElementById('repo-list');
        this.inputEl = document.querySelector('input[name=repository]');
        this.inputEl.focus();

        this.registerHandlers();
    }

    registerHandlers(){
        this.formEl.onsubmit = event => this.addRepository(event);
    }
    
    setLoading(loading = true){
        if(loading === true){
            let loadingEl = document.createElement('div');
            loadingEl.setAttribute('id', 'loading');
            loadingEl.setAttribute('class', 'col-2');
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src','./img/giphy.gif');
            // loadingEl.appendChild(document.createTextNode("Carregando"));
            loadingEl.appendChild(imgEl);
            this.divSearchEl.appendChild(loadingEl);
            
        }else{
            document.getElementById('loading').remove();
        }
    }
    
    async addRepository(event){
        event.preventDefault();
        
        const user = this.inputEl.value;
        
        if(user.length === 0)
        return;
        
        this.setLoading();

        try{
            const response = await api.get(`/users/${user}`);
    
            const { 
                avatar_url, 
                name, 
                bio, 
                html_url, 
                location, 
                public_repos,
                followers,
                following } = response.data;
    
            // this.repositories.push({
            //     avatar_url,
            //     name,
            //     bio,
            //     html_url,
            // });
            this.repositories.unshift({
                avatar_url,
                name,
                bio,
                html_url,
                location,
                public_repos,
                followers,
                following,
            });
    
            this.inputEl.value = '';
    
            this.render();
        } catch (err){
            swal({
                title: 'Sinto muito',
                text: 'O usuário não foi encontrado.',
                icon: 'error',
                button: 'Entendi'
            }).then(value => {
                this.inputEl.value = '';
                this.inputEl.focus();
            });
        }

        this.setLoading(false);
    }

    render(){
        this.listEl.innerHTML = "";

        this.repositories.forEach(repo =>{
            let hrEl = document.createElement('hr');

            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);
            
            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));
            
            let locationEl = document.createElement('span');
            locationEl.appendChild(document.createTextNode(repo.location));
            locationEl.setAttribute('class', 'location');
            
            let publicReposEl = document.createElement('span');
            publicReposEl.appendChild(document.createTextNode("Repositórios "+repo.public_repos));
            publicReposEl.setAttribute('class', 'number');

            let followersEl = document.createElement('span');
            followersEl.appendChild(document.createTextNode("Seguidores "+repo.followers));
            followersEl.setAttribute('class', 'followers');
            
            let followingEl = document.createElement('span');
            followingEl.appendChild(document.createTextNode("Seguindo "+repo.following));
            followingEl.setAttribute('class', 'following');

            let bioEl = document.createElement('p');
            bioEl.appendChild(document.createTextNode(repo.bio));
            
            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode("Ver perfil"));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(hrEl);
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(locationEl);
            listItemEl.appendChild(publicReposEl);
            listItemEl.appendChild(followingEl);
            listItemEl.appendChild(followersEl);
            listItemEl.appendChild(bioEl);
            listItemEl.appendChild(linkEl);

            this.listEl.appendChild(listItemEl);
        });
    }
}

new App();