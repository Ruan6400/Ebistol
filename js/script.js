let tela;
let etapa = "menu"
let paralax = 0
let Spawn_timer = 0
let Spawn_rate = 150
let txtScore;
let direcao = {x:0,y:0}
let velocidadeX = 3
let velocidadeY = 3
let dashable = true
let dashspeed = -8
let player_timer =0
let player;
let dir = false;let esq = false;let cim = false; let dow = false;let dash = false
let shoot_ready = true
let bullets
let score = 0
let HP = 5
let player_hitbox;
let hearts
let deadbody;
let winner;

let Boss
let bossfight = false

let Controles = {
    keyDown: tecla =>{
        switch(tecla.keyCode){
            case 37: esq = true
                break;
            case 65: esq = true
                break;
            case 39: dir = true
                break;
            case 68: dir = true
                break;
            /*case 40: dow = true
                break;
            case 83: dow = true
                break;*/
            case 38: dash = true
                break;
            case 87: dash = true
                break;
            case 32: if(shoot_ready&&player.timer_recoil==0){
                Shoot()
                player.animacao_atual = Player_anim.shoot
                player.Fps=3
                player.frame=0
                shoot_ready=false
            
            }
                break;
            case 16: dash = true
                break
        }
    },
    keyUp: tecla =>{
        switch(tecla.keyCode){
            case 37: esq = false
                break;
            case 65: esq = false
                break;
            case 39: dir = false
                break;
            case 68: dir = false
                break;
            case 40: dow = false
                break;
            case 83: dow = false
                break;
            case 38: dash = false
                break;
            case 87: dash = false
                break;
            case 32:
                break;
            case 16: dash = false
                break;
        }
    },
    movendo:()=>{
        player_hitbox.style.left = player.offsetLeft+20+"px"
        player_hitbox.style.top = player.offsetTop+15+"px"
        if(!esq&&!dir){direcao.x = 0}
        if(dir){direcao.x = velocidadeX}
        if(esq){direcao.x = -1*velocidadeX}
        if(velocidadeY!=dashspeed&&dashable){
            if(!dow&&!cim){direcao.y = 0}
            if(cim){direcao.y = -1*velocidadeY}
            if(dow){direcao.y = velocidadeY}
        }

        if(dashable){
            if(dash){
                velocidadeY = dashspeed
                direcao.y = velocidadeY
                dashable = false
            }
        }else{
            if(velocidadeY>0){player_timer++}
            if(player_timer>=60){
                player_timer = 0
                dashable =true
            }
        }
        if(velocidadeY == dashspeed){
            player_timer++
            if(player_timer>=15){
                player_timer =0
                velocidadeY =2
                direcao.y = velocidadeY
            }
        }

        if(player.knocked){
            player.time_knock++
            if(player.time_knock>=60){
                player.time_knock=0
                player.knocked=false
            }
        }
        if(velocidadeX==1){
            player.timer_slow++
            if(player.timer_slow>=40){
                velocidadeX=3
                velocidadeY=3
            }
        }

        if(!shoot_ready){
            player.timer_recoil++
            if(player.timer_recoil>=15){
                player.timer_recoil=0
                shoot_ready=true
            }
        }
    },
    clamp:()=>{
        if(player.offsetTop >= (tela.offsetHeight-player.offsetHeight) && direcao.y>0){direcao.y=0}
        if(player.offsetTop <= 0 && direcao.y<0){direcao.y=0}
        if(player.offsetLeft >= (tela.offsetWidth-player.offsetWidth) && direcao.x>0){direcao.x=0}
        if(player.offsetLeft <= 0 && direcao.x<0){direcao.x=0}
    },
    animacao:()=>{
        if(!player.knocked){
            if((velocidadeY == 1||velocidadeY==2||velocidadeY==3)&&shoot_ready&&player.animacao_atual!=Player_anim.idle&&direcao.y!=dashspeed){
                player.animacao_atual = Player_anim.idle
                player.Fps=15
                player.frame=0
            }
            if(player.frame == 3 &&player.animacao_atual == Player_anim.shoot&&!shoot_ready){
                player.animacao_atual = Player_anim.idle
                player.Fps=15
                player.frame=0
                
            }
            if(direcao.y==2&&player.animacao_atual==Player_anim.dash){
                player.animacao_atual = Player_anim.idle
                player.Fps=15
                player.frame=0
                
            }

            if(velocidadeY == dashspeed&&player.animacao_atual!=Player_anim.dash){
                player.animacao_atual = Player_anim.dash
                player.Fps=3
                player.frame=0
                
            }
        }else{
            if(player.animacao_atual!=Player_anim.hit){
                player.animacao_atual=Player_anim.hit
                player.frame=0
                player.Fps=5
            }
        }
        Animar(player,player.Fps,player.animacao_atual)

    }
}

function Shoot(){
    let bala = document.createElement('div')
    bala.zigzag = 2
    bala.timer=0
    bala.classList.add('bullet')
    bala.style.top = (player.offsetTop-bala.offsetHeight)+"px"
    bala.style.left = Math.round(player.offsetLeft+((player.offsetWidth/2)-(bala.offsetWidth/2)))+"px"
    tela.insertAdjacentElement('beforeend',bala)
}
function Bullet(){
    bullets = document.querySelectorAll('.bullet')
    bullets.forEach(bullet=>{
        bullet.timer++
        if(bullet.timer>10){
            bullet.zigzag*=-1
            bullet.timer=0
        }
        Mover(bullet,{x:bullet.zigzag,y:-5})
        let inimigos = document.querySelectorAll('.hitbox_enemy')
        inimigos.forEach(enemy=>{
            if(Colisao_Quadrada(bullet,enemy)){
                bullet.remove()
                enemy.own.HP--
            }
        })
        if(bullet.offsetTop<(bullet.offsetHeight*-1)){bullet.remove()}
    })
}


function Spawn(){
    Spawn_timer++
    let inimigos = ['peixe','peixe','agua_viva','moreia','shell']
    if(Spawn_timer>=Spawn_rate){
        let enemy = document.createElement('div')
        let random = Math.floor(Math.random()*1.999)

        
        enemy.classList.add(inimigos[Math.round(Math.random()*(inimigos.length-1))])
        //enemy.classList.add('shell')
        enemy.style.top = Math.round((Math.random()*(tela.offsetHeight-200))+0)+"px"
        enemy.style.left = (random == 1?  tela.offsetWidth:  -128)+"px"

        tela.appendChild(enemy)
        Spawn_timer=0;
    }

}

function Moreia(){
    let moreias = document.querySelectorAll('.moreia')
    moreias.forEach(moreia=>{
        if(moreia.direcao == null){
            moreia.direcao=moreia.offsetLeft<=0 ?"esquerda" : "direita";
            moreia.style.transform=`scale(${moreia.direcao=="esquerda"?-1:1},1)`
            moreia.movimento = {x:moreia.direcao == "esquerda"?1:-1,y:0}
            moreia.fps=15
            moreia.style.top = Math.round(Math.random()*(tela.offsetHeight-140)+50)+"px"
            moreia.charge_counter=0;


            moreia.hitbox = document.createElement('div')
            moreia.hitbox.classList.add('hitbox_enemy')
            moreia.hitbox.style = `width:${moreia.direcao=="esquerda"?125:140}px; height:20px;`
            moreia.hitbox.style.backgroundColor="#f000"
            moreia.hitbox.own = moreia
            moreia.HP = 1
            tela.appendChild(moreia.hitbox)

        }
        if(Math.abs((moreia.offsetLeft+75)-(tela.offsetWidth/2))<=330&& moreia.charge_counter<=100){
            moreia.fps=3
            moreia.charge_counter++
            if(moreia.charge_counter==95){moreia.movimento.x*=5}
        }else{
            Mover(moreia,moreia.movimento)
        }
        Animar(moreia,moreia.fps,moray,{w:750,h:150})

        if(Colisao_Quadrada(player_hitbox,moreia.hitbox)&&!player.knocked&&velocidadeY!=dashspeed){
            player.knocked = true
            HP--
        }

        moreia.hitbox.style.left = (moreia.offsetLeft+10)+"px"
        moreia.hitbox.style.top = (moreia.offsetTop+60)+"px"
        
        if(moreia.offsetLeft<(-1*moreia.offsetWidth-30)||moreia.offsetLeft>tela.offsetWidth+30){
            moreia.hitbox.remove()
            moreia.remove()
            
        }

        if(moreia.HP<=0){
            ShowPoints(moreia.hitbox)
            moreia.hitbox.remove()
            moreia.remove()
            score++
            if(Spawn_rate>50)
                Spawn_rate-=5
        }
    })
    
}
function ShowPoints(obj){
    let point = document.createElement('p')
    point.innerHTML = "+1"
    point.classList.add('point')
    point.style.top = (obj.offsetTop+Math.round(obj.offsetHeight/2))+"px"
    point.style.left = (obj.offsetLeft+Math.round(obj.offsetWidth/2))+"px"
    tela.insertAdjacentElement('beforeend',point)
    setTimeout(()=>point.remove(),1000)
    
}
function Jellyfish(){
    let jellyfishes = document.querySelectorAll('.agua_viva')
    jellyfishes.forEach(jfsh=>{
        if(jfsh.direcao == null){
            jfsh.direcao = jfsh.offsetLeft<=0? "esquerda" : "direita";
            jfsh.float = -3
            jfsh.timer_float=0
            jfsh.float_speed=1
            jfsh.timer_atk = 0

            jfsh.animacao_atual = jellyfish.idle
            jfsh.sprite_size = {w:512,h:128}
            jfsh.movimento = {x:jfsh.direcao == "esquerda"?1:-1,y:0}
            jfsh.fps=15

            /**Range da hitbox da agua viva */
            jfsh.eletrostatic = 25
            jfsh.dir_raios = [
                {rotacao:0,sentido:{x:0,y:-1},posicao:{x:30,y:0}},
                {rotacao:90,sentido:{x:1,y:0},posicao:{x:75,y:50}},
                {rotacao:180,sentido:{x:0,y:1},posicao:{x:30,y:75}},
                {rotacao:270,sentido:{x:-1,y:0},posicao:{x:0,y:50}},
                {rotacao:45,sentido:{x:1,y:-1},posicao:{x:75,y:10}},
                {rotacao:135,sentido:{x:1,y:1},posicao:{x:75,y:75}},
                {rotacao:225,sentido:{x:-1,y:1},posicao:{x:0,y:75}},
                {rotacao:315,sentido:{x:-1,y:-1},posicao:{x:0,y:0}}
            ]


            jfsh.hitbox = document.createElement('div')
            jfsh.hitbox.classList.add('hitbox_enemy')
            jfsh.hitbox.style = "width:25px; height:25px;"
            jfsh.hitbox.style.backgroundColor="#0f00"
            jfsh.hitbox.own = jfsh
            jfsh.HP = 1



            tela.appendChild(jfsh.hitbox)
        }

        if((Math.abs(jfsh.hitbox.offsetLeft-player_hitbox.offsetLeft)>=50||jfsh.timer_atk>=152)&&(jfsh.animacao_atual == jellyfish.idle)){
            
            //comandos para movimentação
            jfsh.timer_float++
            if(jfsh.timer_float>=2){
                jfsh.timer_float = 0
                jfsh.float+=jfsh.float_speed
                if(jfsh.float>=6||jfsh.float<=-6){jfsh.float_speed*=-1}
                jfsh.movimento.y = jfsh.float
                Mover(jfsh,jfsh.movimento)
            }
        }else{
            if(jfsh.animacao_atual==jellyfish.idle&&jfsh.timer_atk==0){
                jfsh.timer_atk=1
                jfsh.frame=0
                jfsh.fps=5
                jfsh.animacao_atual=jellyfish.lightningup
                jfsh.sprite_size={w:640,h:128}
            }
            if(jfsh.animacao_atual==jellyfish.lightningup&&jfsh.frame>=4){
                jfsh.frame=0
                jfsh.fps=5
                jfsh.eletrostatic = 50
                jfsh.animacao_atual=jellyfish.sparking
                jfsh.sprite_size={w:512,h:128}
            }
            if(jfsh.timer_atk>150){
                jfsh.frame=0
                jfsh.fps=5
                jfsh.eletrostatic = 25
                jfsh.animacao_atual=jellyfish.idle
                jfsh.sprite_size={w:512,h:128}
            }

            if(jfsh.timer_atk%50 == 0){
                let dir_ini=(jfsh.timer_atk/50)%2==0?0:4
                let dir_end=(jfsh.timer_atk/50)%2==0?4:8
                for(let i = dir_ini;i<dir_end;i++){
                    let raio = document.createElement('div')
                    raio.direcao = jfsh.dir_raios[i]
                    raio.classList.add('spark')
                    raio.style.top = (jfsh.offsetTop+raio.direcao.posicao.y)+"px"
                    raio.style.left = (jfsh.offsetLeft+raio.direcao.posicao.x)+"px"
                    tela.insertAdjacentElement('beforeend',raio)
                }
            }
        }
        if(jfsh.timer_atk>0){
            jfsh.timer_atk++
            if(jfsh.timer_atk>=300)
                jfsh.timer_atk=0
        }
        
        jfsh.hitbox.style.left = (jfsh.offsetLeft+52)+"px"
        jfsh.hitbox.style.top = (jfsh.offsetTop+55)+"px"
        Animar(jfsh,jfsh.fps,jfsh.animacao_atual,jfsh.sprite_size)

        if(jfsh.offsetTop<=100)
            jfsh.style.top=(jfsh.offsetTop+1)+"px"

        if(jfsh.HP<=0){
            ShowPoints(jfsh.hitbox)
            jfsh.hitbox.remove()
            jfsh.remove()
            score++
            if(Spawn_rate>50)
                Spawn_rate-=5
        }
        if(jfsh.offsetLeft<(-1*jfsh.offsetWidth-30)||jfsh.offsetLeft>tela.offsetWidth+30){
            jfsh.hitbox.remove()
            jfsh.remove()
            
        }
        if(Colisao_Circular(player_hitbox,jfsh.hitbox,jfsh.eletrostatic)&&!player.knocked&&velocidadeY!=dashspeed){
            player.knocked = true
            HP--
        }
    })
    let Raios = ()=>{
        let sparks = document.querySelectorAll('.spark')
        sparks.forEach(raio=>{
            Animar(raio,5,jellyfish.spark,{w:192,h:64})
            raio.style.transform = "rotate("+raio.direcao.rotacao+"deg)"
            Mover(raio,raio.direcao.sentido)
            if(raio.offsetTop>tela.offsetHeight||
                raio.offsetTop<=(raio.offsetHeight*-1)||
                raio.offsetLeft>=(tela.offsetWidth)||
                raio.offsetLeft <= (raio.offsetWidth*-1)
            ){
                raio.remove()
            }
            if(Colisao_Circular(player_hitbox,raio,16)&&velocidadeY!=dashspeed){
                if(!player.knocked){
                    HP-=1
                    player.knocked = true
                    raio.remove()
                }
            }
        })
    }
    Raios()
}
function Shell(){
    let shells = document.querySelectorAll('.shell')
    shells.forEach(shell=>{
        if(shell.direcao == null){
            shell.direcao = "nenhuma";
            shell.movimento = {x:0,y:1}
            shell.float_side=0
            shell.floatdir = 1
            shell.timer_float =0
            shell.style.top="-128px"
            shell.style.left= (Math.round(Math.random()*(tela.offsetWidth-128)))+"px"
            shell.animacao_atual = concha.idle
            shell.fps = 10
            shell.sprite_size = {w:512,h:128}
            shell.HP =1



            shell.hitbox= document.createElement('div')
            shell.hitbox.style = `width:30px;height:30px`
            shell.hitbox.classList.add('hitbox_enemy')
            shell.hitbox.own = shell
            tela.insertAdjacentElement('beforeend',shell.hitbox)

            shell.chasing = false
        }
        shell.timer_float++
        if(shell.timer_float == 5&& !shell.chasing){
            if(Math.abs(shell.float_side)>=4){
                shell.floatdir*=-1
            }
            shell.float_side+=shell.floatdir
            shell.timer_float=0
        }

        shell.hitbox.style.top=(shell.offsetTop+50)+"px"
        shell.hitbox.style.left=(shell.offsetLeft+50)+"px"
        shell.movimento.x = shell.float_side
        Mover(shell,shell.movimento)


        if(Colisao_Circular(shell.hitbox,player_hitbox,200)){
            shell.chasing=true
            shell.float_side=0
        }
        if(shell.chasing){
            if(shell.animacao_atual == concha.idle){
                shell.animacao_atual = concha.perseguir
                shell.frame = 0
                shell.fps = 5
                shell.movimento.y= 2
                shell.sprite_size.w=256
            }

            shell.float_side=shell.hitbox.offsetLeft-player_hitbox.offsetLeft < 0?1:-1;

            if(shell.animacao_atual == concha.perseguir && Colisao_Circular(shell.hitbox,player_hitbox,150)){
                shell.animacao_atual = concha.morder
                shell.frame=0
                shell.sprite_size.w=640
            }
        }
        if(Colisao_Quadrada(player_hitbox,shell.hitbox)&&!player.knocked){
            player.knocked=true
            HP--
        }
        if(shell.HP<=0){
            ShowPoints(shell.hitbox)
            shell.hitbox.remove()
            shell.remove()
            score++
            if(Spawn_rate>50)
                Spawn_rate-=5
        }


        Animar(shell,shell.fps,shell.animacao_atual,shell.sprite_size)





        if(shell.offsetTop>tela.offsetHeight){
            shell.hitbox.remove()
            shell.remove()
        }
    })
}
function Peixe(){
    let peixes = document.querySelectorAll('.peixe')
    peixes.forEach(peixe=>{
        if(peixe.direcao == null){
            peixe.direcao = peixe.offsetLeft<=0? "esquerda" : "direita";
            peixe.animacao = peixe_anim[Object.keys(peixe_anim)[Math.floor(Math.random()*1.999)]]
            peixe.hitbox = document.createElement('div')
            peixe.hitbox.classList.add('hitbox_enemy')
            peixe.hitbox.style = "width:35px; height:25px;"
            peixe.hitbox.style.backgroundColor="#ff00"
            peixe.hitbox.own = peixe
            peixe.HP = 1
            tela.appendChild(peixe.hitbox)
        }
        Animar(peixe,5,peixe.animacao,{w:512,h:64})
        peixe.hitbox.style.left = (peixe.offsetLeft+15)+"px"
        peixe.hitbox.style.top = (peixe.offsetTop+20)+"px"
        if(peixe.direcao == "direita"){
            Mover(peixe,{x:-2,y:bossfight?0:1})
            peixe.style.transform = "scale(-1,1)"
        }else{
            Mover(peixe,{x:2,y:bossfight?0:1})
        }
        if(peixe.HP<=0){
            ShowPoints(peixe.hitbox)
            peixe.hitbox.remove()
            peixe.remove()
            score++
            if(Spawn_rate>50)
                Spawn_rate-=5
        }
        if(peixe.offsetLeft<(-1*peixe.offsetWidth-30)||peixe.offsetLeft>tela.offsetWidth+30){
            peixe.hitbox.remove()
            peixe.remove()
            
        }
        if(Colisao_Circular(player_hitbox,peixe.hitbox,30)&&!player.knocked&&velocidadeY!=dashspeed){
            player.knocked = true
            HP--
        }
    })
}


function SpawnBoss(){
    tela.insertAdjacentHTML('beforeend','<div id="Boss"></div>')
    tela.insertAdjacentHTML('beforeend','<div id="boss_col"></div>')
    Boss = document.getElementById('Boss')
    Boss.hitbox = document.getElementById('boss_col')
    Boss.hitbox.classList.add('hitbox_enemy')
    Boss.hitbox.own = Boss
    Boss.HP = 30
    Boss.HP_tilt = 30
    Boss.style.left = Math.round(tela.offsetWidth/2-Boss.offsetWidth/2)+"px"
    Boss.style.top = "-180px"
    Boss.acao = "aparecer"
    Boss.timer_2 = 0
    Boss.spikes = Math.round(   100 - (   (3.3*Boss.HP)/2   )   )
    Boss.acoes_secundarias = 0
    Boss.lado_da_tela=0
    Boss.animacao_atual = Boss_anim.idle
    Boss.frame_size = {w:1536,h:256}
    Boss.body_range = 50
    Boss.acoes_principais = ['Shooting','Emboscar','Bixo Piruleta','Oh u GAAIZ','Shooting']
    Boss.mira_spikes = [
        //cima
        {direcao:{x:0,y:-5},rotacao:"0",posicao:{x:110,y:70}},
        //direita
        {direcao:{x:5,y:0},rotacao:"90deg",posicao:{x:170,y:110}},
        //baixo
        {direcao:{x:0,y:5},rotacao:"180deg",posicao:{x:110,y:170}},
        //esquerda
        {direcao:{x:-5,y:0},rotacao:"270deg",posicao:{x:60,y:110}},
        //45°
        {direcao:{x:5,y:-5},rotacao:"45deg",posicao:{x:130,y:50}},
        //135°
        {direcao:{x:5,y:5},rotacao:"135deg",posicao:{x:150,y:150}},
        //225°
        {direcao:{x:-5,y:5},rotacao:"225deg",posicao:{x:70,y:170}},
        //315°
        {direcao:{x:-5,y:-5},rotacao:"315deg",posicao:{x:70,y:50}},
        //157°
        {direcao:{x:2,y:5},rotacao:"157deg",posicao:{x:150,y:150}},
        //202°
        {direcao:{x:-2,y:5},rotacao:"202deg",posicao:{x:70,y:170}},

    ]
    Boss.Fps =5
    Boss.movimento = {x:0,y:0}
    Boss.direcao_varar_gaz = 1
    
}
//alguma coisa
function Boss_Battle(){
    switch(Boss.acao){
        case "aparecer":
            Boss.timer_2++
            Mover(Boss,{x:0,y:1})
            if(Boss.timer_2 >= 150){
                Boss.acao = "standby"
                Boss.timer_2 = 0;
            }
            break;
        case "standby":
            Boss.timer_2++
            if(Boss.timer_2 >= (3.3*Boss.HP)){
                Boss.timer_2 =0
                Boss.acoes_secundarias =0
                Boss.acao = Boss.acoes_principais[Math.round(Math.random()*    (Boss.acoes_principais.length-1)   )]
                //Boss.acao = "Oh u GAAIZ"
            }
            break;
        case "Shooting":
            if(Boss.acoes_secundarias != 6){
                switch(Boss.acoes_secundarias){
                    case 0:
                        Boss.style.top=(Boss.offsetTop+1)+"px"
                        if(Boss.offsetTop >= 30){Boss.acoes_secundarias = 1}
                        break;
                    case 1:
                        //animacao pra girar -1
                        if(Boss.animacao_atual!=Boss_anim.inflate){
                            Boss.animacao_atual = Boss_anim.inflate;
                            Boss.frame=1
                            Boss.Fps=3
                        }
                        if(Boss.frame>=5){
                            Boss.acoes_secundarias=2
                        }
                        break;
                    case 2:
                        //animacao p girar 2
                        if(Boss.animacao_atual!=Boss_anim.prp_spin){
                            Boss.animacao_atual = Boss_anim.prp_spin;
                            Boss.frame=0
                            Boss.Fps=3
                            Boss.frame_size = {w:1536,h:256}
                        }
                        if(Boss.frame>=5){
                            Boss.acoes_secundarias=3
                        }
                        break;
                    case 3:
                        //girando
                        if(Boss.animacao_atual!=Boss_anim.spin){
                            Boss.animacao_atual = Boss_anim.spin;
                            Boss.frame=0
                            Boss.Fps=3
                            Boss.frame_size = {w:1024,h:256}
                        }
                        if(Boss.spikes>0){
                            if(Boss.timer_2 == 0){
                                let pike = document.createElement('div')
                                pike.classList.add('spike')
                                let dir_random = Math.round(Math.random()*9)
                                pike.mira = Boss.mira_spikes[dir_random]
                                pike.style.top = (Boss.offsetTop+pike.mira.posicao.y)+"px"
                                pike.style.left = (Boss.offsetLeft+pike.mira.posicao.x)+"px"
                                pike.style.transform = "rotate("+pike.mira.rotacao+")"
                                tela.insertAdjacentElement('beforeend',pike)
                                Boss.spikes-=1
                            }
                            Boss.timer_2++
                            if(Boss.timer_2>=3){
                                Boss.timer_2 = 0
                            }
                        }else{
                            Boss.timer_2 = 0
                            Boss.spikes = Math.round(   100 - (   (3.3*Boss.HP)/2   )   )
                            Boss.acoes_secundarias = 4
                        }  
                        break;
                    case 4:
                        //desinflar
                        if(Boss.animacao_atual!=Boss_anim.deflate){
                            Boss.animacao_atual = Boss_anim.deflate;
                            Boss.frame=0
                            Boss.Fps=3
                            Boss.frame_size = {w:1536,h:256}
                        }
                        if(Boss.frame>=5){
                            Boss.acoes_secundarias=5
                        }
                        break;
                    case 5:
                        //voltar
                        if(Boss.animacao_atual!=Boss_anim.idle){
                            Boss.animacao_atual = Boss_anim.idle;
                            Boss.frame=0
                            Boss.Fps=5
                        }
                        Boss.style.top = (Boss.offsetTop-1)+"px"
                        if(Boss.offsetTop<=-30){
                            Boss.timer_2=0
                            Boss.acoes_secundarias =0
                            Boss.acao="standby"
                        }
                        break;
                }
            }
                    
            break;
        case "Emboscar":
            if(Boss.acoes_secundarias != 5){
                switch(Boss.acoes_secundarias){
                    case 0:
                        //recuar
                        Boss.style.top=(Boss.offsetTop-1)+"px"
                        if(Boss.offsetTop <= -150){Boss.acoes_secundarias = 1}
                        break;
                    case 1:
                        //decidir pra q lado vai
                        Boss.lado_da_tela = Math.round(Math.random())
                        if(Boss.lado_da_tela == 1){
                            Boss.style.left = tela.offsetWidth+"px"
                            Boss.style.transform = "rotate(90deg)"
                        }else{
                            Boss.style.left = (-1*Boss.offsetWidth)+"px";
                            Boss.style.transform = "rotate(270deg)"
                        }
                        Boss.style.top = (tela.offsetHeight-Boss.offsetHeight)+"px"
                        Boss.acoes_secundarias = 2
                        break;
                    case 2:
                        //aproximação sorrateira
                        let bossdir = Boss.lado_da_tela == 1?-7:7;
                        Boss.timer_2++
                        Boss.style.left = (Boss.offsetLeft+bossdir)+"px"
                        if(Boss.timer_2>=60){
                            Boss.timer_2 = 0
                            Boss.acoes_secundarias = 3
                        }
                        break;
                    case 3:
                        //Inflação da Venezuela
                        if(Boss.animacao_atual!=Boss_anim.max_inflate){
                            Boss.animacao_atual = Boss_anim.max_inflate;
                            Boss.frame=0
                            Boss.Fps=3
                        }
                        if(Boss.frame>=6){
                            Boss.body_range=100
                        }
                        if(Boss.frame>=18){
                            Boss.acoes_secundarias = 4
                            Boss.body_range=50
                        }
                        break;
                    case 4:
                        //recuando dnv
                        if(Boss.animacao_atual!= Boss_anim.idle){
                            Boss.frame = 0
                            Boss.Fps = 5
                            Boss.animacao_atual = Boss_anim.idle;
                        }
                        Boss.style.left=(Boss.offsetLeft+(Boss.style.transform == "rotate(270deg)"?-7:7))+"px";
                        if(Boss.offsetLeft<-150||Boss.offsetLeft>tela.offsetWidth){
                            Boss.style.transform = "rotate(0)"
                            Boss.style.left =  Math.round(tela.offsetWidth/2-Boss.offsetWidth/2)+"px"
                            Boss.style.top = "-180px"
                            Boss.acao = "aparecer"
                            Boss.acoes_secundarias=0
                            Boss.timer_2 =0
                        }
                        break;
                }
            }
            break;
        case "Bixo Piruleta":
            if(Boss.acoes_secundarias!=5){
                switch(Boss.acoes_secundarias){
                    case 0:
                        if(Boss.animacao_atual!=Boss_anim.inflate){
                            Boss.animacao_atual = Boss_anim.inflate;
                            Boss.frame=0
                            Boss.Fps=5
                        }
                        if(Boss.frame>=5){
                            Boss.acoes_secundarias=1
                        }
                        break;
                    case 1:
                        if(Boss.animacao_atual!=Boss_anim.prp_spin){
                            Boss.animacao_atual = Boss_anim.prp_spin;
                            Boss.frame=0
                            Boss.Fps=5
                        }
                        if(Boss.frame>=5){
                            Boss.acoes_secundarias=2
                        }
                        break;
                    case 2:
                        if(Boss.animacao_atual!=Boss_anim.spin){
                            Boss.animacao_atual = Boss_anim.spin;
                            Boss.frame=0
                            Boss.Fps=3
                            Boss.frame_size = {w:1024,h:256}
                        }
                        if(Boss.movimento.x==0){Boss.movimento.x=(Math.round(Math.random()*7)+3)* (3-Math.round((Boss.HP/30)*2))}
                        if(Boss.movimento.y==0){Boss.movimento.y=(Math.round(Math.random()*4)+4)* (3-Math.round((Boss.HP/30)*2))}
                        
                        if(Boss.offsetLeft>=tela.offsetWidth-180||Boss.offsetLeft<=-70){
                            Boss.movimento.x*=-1
                        }
                        if(Boss.offsetTop>=tela.offsetHeight-180||Boss.offsetTop<=-90){
                            Boss.movimento.y*=-1
                        }
                        Mover(Boss,Boss.movimento)
                        Boss.timer_2++
                        if(Boss.timer_2>=300){
                            Boss.timer_2=0
                            Boss.acoes_secundarias=3
                        }
                        break;
                    case 3:
                        //retornando a pos original
                        let pos_incial = {x:Math.round(tela.offsetWidth/2-Boss.offsetWidth/2),y:-70}
                        Boss.movimento.x=Boss.offsetLeft>pos_incial.x?-2:2;
                        Boss.movimento.y=Boss.offsetTop>pos_incial.y?-2:2;
                        Mover(Boss,Boss.movimento)
                        if(Math.abs(Boss.offsetLeft-pos_incial.x)<=10&&Math.abs(Boss.offsetTop-(pos_incial.y))<=10){
                            Boss.acoes_secundarias = 0
                            Boss.timer_2 = 0
                            Boss.acao = "standby"
                            Boss.animacao_atual = Boss_anim.idle
                            Boss.frame_size = {w:1536,h:256}
                            Boss.Fps = 5
                            Boss.movimento = {x:0,y:0}
                        }
                        break;
                }
            }
            break;
        case "Oh u GAAIZ":
            if(Boss.acoes_secundarias!=5){
                switch(Boss.acoes_secundarias){
                    case 0:
                        let direcao_random = Math.round(Math.random())
                        Boss.direcao_varar_gaz = direcao_random == 1?1:-1
                        Boss.acoes_secundarias=1
                        break;
                    case 1:
                        Mover(Boss,{x:-3*Boss.direcao_varar_gaz,y:0})
                        Boss.timer_2++
                        if(Boss.timer_2>=60){
                            Boss.timer_2=0
                            Boss.acoes_secundarias=2
                        }
                        break;
                    case 2:
                        if(Boss.animacao_atual!=Boss_anim.inflate){
                            Boss.animacao_atual = Boss_anim.inflate;
                            Boss.frame=0
                            Boss.Fps=3
                        }
                        if(Boss.frame>=5){
                            Boss.acoes_secundarias=3
                        }
                        break;
                    case 3:
                        if(Boss.animacao_atual!=Boss_anim.toxic_gas){
                            Boss.animacao_atual=Boss_anim.toxic_gas
                            Boss.frame=0
                            Boss.Fps=5
                            Boss.frame_size = {w:2560,h:512}
                        }
                        if(Boss.frame>=3){
                            Boss.acoes_secundarias = 4
                        }
                        break;
                    case 4:
                        if(Boss.animacao_atual!=Boss_anim.toxic_gas_2){
                            Boss.frame=0
                            Boss.Fps=5
                            Boss.animacao_atual=Boss_anim.toxic_gas_2
                        }
                        Mover(Boss,{x:2*Boss.direcao_varar_gaz,y:0})
                        if(Boss.timer_2 == 0){
                            let f4rt = document.createElement('div')
                            f4rt.classList.add('gas')
                            f4rt.style.top = (Boss.offsetTop+140)+"px"
                            f4rt.style.left = (Boss.offsetLeft+80)+"px"
                            f4rt.hitbox = document.createElement('div')
                            f4rt.hitbox.classList.add('gascolision')

                            tela.insertAdjacentElement('beforeend',f4rt)
                            tela.insertAdjacentElement('beforeend',f4rt.hitbox)
                        }
                        Boss.timer_2++
                        if(Boss.timer_2>=20){Boss.timer_2=0}
                        if(Math.abs((Boss.offsetLeft+Boss.offsetWidth/2)-tela.offsetWidth/2)<=10){
                            Boss.acoes_secundarias=0
                            Boss.timer_2=0
                            Boss.acao = "standby"
                            Boss.Fps=5
                            Boss.animacao_atual=Boss_anim.idle
                            Boss.frame_size = {w:1536,h:256}
                            Boss.frame=0
                        }
                }
            }
            break;
    }
    let Espinho = ()=>{
        let spikes = document.querySelectorAll('.spike')
        spikes.forEach(spike=>{
            Mover(spike,spike.mira.direcao)
            if(spike.offsetTop>tela.offsetHeight||
                spike.offsetTop<=(spike.offsetHeight*-1)||
                spike.offsetLeft>=(tela.offsetWidth)||
                spike.offsetLeft <= (spike.offsetWidth*-1)
            ){
                spike.remove()
            }

            if(Colisao_Circular(player_hitbox,spike,16)&&velocidadeY!=dashspeed){
                if(!player.knocked){
                    HP-=1
                    player.knocked = true
                    spike.remove()
                }
            }
        })
    }
    let Ultragaz = ()=>{
        let gazes = document.querySelectorAll('.gas')
        if(gazes.length>0){
            gazes.forEach(gazinho=>{
                Animar(gazinho,5,gas)
                Mover(gazinho,{x:0,y:5})
                gazinho.hitbox.style.top = gazinho.offsetTop+30+"px"
                gazinho.hitbox.style.left = gazinho.offsetLeft+30+"px"
                if(Colisao_Quadrada(gazinho.hitbox,player_hitbox)){
                    
                    if(velocidadeY!=dashspeed){
                        velocidadeY=1
                        velocidadeX=1
                        player.timer_slow=0
                    }
                }
                if(gazinho.offsetTop>=tela.offsetHeight){
                    gazinho.hitbox.remove()
                    gazinho.remove()
                }
            })
        }
    }
    Espinho()
    Ultragaz()
    Boss.hitbox.style.left=Boss.offsetLeft+95+"px"
    Boss.hitbox.style.top=Boss.offsetTop+100+"px"
    if(Colisao_Circular(player,Boss.hitbox,Boss.body_range)&&velocidadeY!=dashspeed){
        if(!player.knocked){
            player.knocked=true
            HP--
        }
    }
    if(Boss.HP<=0){
        let Tudo = document.querySelectorAll('#Game>*:not(#Player)')
        winner = document.createElement('div')
        winner.style = "width:64px;height:64px;"
        winner.style.left = player.offsetLeft+"px"
        winner.style.top = player.offsetTop+"px"
        tela.appendChild(winner)
        Tudo.forEach(x=>x.remove())
        player.style.opacity="0"
        etapa="win"
        document.querySelector('audio:last-of-type').pause()
        /*
        tela.insertAdjacentHTML('beforeend','<div id="win"></div>')
        tela.insertAdjacentHTML('beforeend','<p>Clique em qualquer lugar para continuar</p>')
        document.getElementById('win').addEventListener('click',()=>{
            Tudo = document.querySelectorAll('#Game>*')
            Tudo.forEach(x=>x.remove())
            etapa="menu"
            tela.style.backgroundPosition = "0 0"
            tela.style.backgroundImage="url(telas/Tela_Inicial.png)"
            document.querySelector('audio').currentTime=0
            document.querySelector('audio').play()
            tela.insertAdjacentHTML('beforeend','<button id="bt_start"></button>')
            tela.insertAdjacentHTML('beforeend','<button id="exit"></button>')
            let bt_start =  document.querySelector('#bt_start')
            let bt_exit = document.getElementById('exit')

            bt_exit.addEventListener('click',()=>{window.close()})
            bt_start.addEventListener('click',()=>{
                document.querySelectorAll('button').forEach(bt=>bt.remove())
                tela.style.backgroundImage="url(telas/gameplaybackgroundsketch.png)"
                
                Game_Start()
            })
        })*/
        
    }
    if(Boss.acoes_principais.length == 6 && Boss.HP<=20){
        Boss.acoes_principais.push("Bixo Piruleta")
    }
    if(Boss.acoes_principais.length == 7 && Boss.HP<=10){
        Boss.acoes_principais.push("Shooting")
    }
    Animar(Boss,Boss.Fps,Boss.animacao_atual,Boss.frame_size)

    if(Boss.HP!=Boss.HP_tilt){
        if(Boss.animacao_atual==Boss_anim.spin||Boss.acao=="Emboscar"||Boss.acao=="aparecer"){
            Boss.HP++
        }else{
            Boss.style.transform = "scale(1,0.625)"
            setTimeout(()=>Boss.style.transform = "scale(1,1)",100)
        }
        Boss.HP_tilt = Boss.HP
    }

}


/**
 * Função pra começar o game
 */
function Game_Start(){
    tela.insertAdjacentHTML('beforeend','<div id="Player"></div>')
    tela.insertAdjacentHTML('beforeend','<p id="score">Score: 0</p>')
    txtScore = document.getElementById('score')
    player = document.getElementById('Player')
    tela.insertAdjacentHTML('beforeend','<div id="Player_hitbox"></div>')
    player_hitbox = document.getElementById('Player_hitbox')
    player.timer_slow=0
    player.knocked = false
    player.time_knock =0
    HP = 5
    score=0
    bossfight=false
    player.timer_recoil = 0
    Spawn_rate=150
    for(let i = 0;i < 5;i++){
        let heart = document.createElement('div')
        heart.classList.add('heart')
        heart.style.left = (i*32)+30+"px"
        tela.insertAdjacentElement('beforeend',heart)
    }

    document.addEventListener('keydown',Controles.keyDown)
    document.addEventListener('keyup',Controles.keyUp)
    player.animacao_atual = Player_anim.idle
    player.Fps=10
    player.style.left = (tela.offsetWidth/2)-(player.offsetWidth/2)+"px"
    player.style.top = (tela.offsetHeight-player.offsetHeight)+"px"
    etapa="game"
}
function Game(){
    txtScore.innerHTML=`Score: ${score}`
    Controles.movendo()
    Controles.clamp()
    Controles.animacao()
    if(HP<=0){
        let musica = document.querySelector(`audio:${bossfight?"last":"first"}-of-type`)
        musica.pause()
        let Tudo = document.querySelectorAll('#Game>*:not(#Player)')
        deadbody = document.createElement('div')
        deadbody.style = "width:64px;height:64px;"
        deadbody.style.left = player.offsetLeft+"px"
        deadbody.style.top = player.offsetTop+"px"
        tela.appendChild(deadbody)
        Tudo.forEach(x=>x.remove())
        player.style.opacity="0"
        tela.style.backgroundImage = "none"
        tela.style.backgroundColor="#000"
        etapa="game over"
    }
    Mover(player,direcao)
    Bullet()
    hearts = document.querySelectorAll('.heart')
    hearts.forEach((coracao,indice)=>{
        Animar(coracao,5,heart)
        if(indice==HP){
            coracao.remove()
        }
    })


    Spawn()
    Peixe()
    Jellyfish()
    Moreia()
    Shell()


    if(bossfight){
        Boss_Battle()
        
    }else{
        if(score >= 20){
            SpawnBoss()
            document.querySelector('audio').pause()
            document.querySelector('audio:last-of-type').currentTime=0
            document.querySelector('audio:last-of-type').play()
            bossfight =true
        }
        paralax++
        tela.style.backgroundPosition = "0 "+paralax+"px"
    }



    
}
function Game_Over(){
    if(deadbody!= null){
        Animar(deadbody,7,Player_anim.death)
    }
    if(deadbody!=null&&deadbody.frame==10){
        deadbody.remove()
        deadbody=null
        let Restos = document.querySelectorAll('#Game :not(p,#gameover)')
        Restos.forEach(trash=>trash.remove())
        tela.insertAdjacentHTML('beforeend','<div id="gameover"></div>')
        tela.insertAdjacentHTML('beforeend','<p>Clique em qualquer lugar para continuar</p>')
        document.getElementById('gameover').addEventListener('click',()=>{
            Tudo = document.querySelectorAll('#Game>*')
            Tudo.forEach(x=>x.remove())
            etapa="menu"
            tela.style.backgroundPosition = "0 0"
            tela.style.backgroundImage="url(telas/Tela_Inicial.png)"
            document.querySelector('audio').currentTime=0
            document.querySelector('audio').play()
            tela.insertAdjacentHTML('beforeend','<button id="bt_start"></button>')
            tela.insertAdjacentHTML('beforeend','<button id="exit"></button>')
            let bt_start =  document.querySelector('#bt_start')
            let bt_exit = document.getElementById('exit')

            bt_exit.addEventListener('click',()=>{window.close()})
            bt_start.addEventListener('click',()=>{
                document.querySelectorAll('button').forEach(bt=>bt.remove())
                tela.style.backgroundImage="url(telas/gameplaybackgroundsketch.png)"
                
                Game_Start()
            })
        })

    }
}
function Win(){
    if(winner!=null){
        Animar(winner,5,Player_anim.dash)
        Mover(winner,{x:0,y:-10})
    }
    if(winner!=null&&winner.offsetTop<-64){
        winner.remove()
        winner=null
        let Restos = document.querySelectorAll('#Game :not(p,#win)')
        Restos.forEach(trash=>trash.remove())
        
        tela.insertAdjacentHTML('beforeend','<div id="win"></div>')
        tela.insertAdjacentHTML('beforeend','<p>Clique em qualquer lugar para continuar</p>')
        document.getElementById('win').addEventListener('click',()=>{
            Tudo = document.querySelectorAll('#Game>*')
            Tudo.forEach(x=>x.remove())
            etapa="menu"
            tela.style.backgroundPosition = "0 0"
            tela.style.backgroundImage="url(telas/Tela_Inicial.png)"
            document.querySelector('audio').currentTime=0
            document.querySelector('audio').play()
            tela.insertAdjacentHTML('beforeend','<button id="bt_start"></button>')
            tela.insertAdjacentHTML('beforeend','<button id="exit"></button>')
            let bt_start =  document.querySelector('#bt_start')
            let bt_exit = document.getElementById('exit')

            bt_exit.addEventListener('click',()=>{window.close()})
            bt_start.addEventListener('click',()=>{
                document.querySelectorAll('button').forEach(bt=>bt.remove())
                tela.style.backgroundImage="url(telas/gameplaybackgroundsketch.png)"
                
                Game_Start()
            })
        })
    }
}



function Start(){
    tela = document.getElementById('Game')
    tela.style.backgroundImage="url(telas/Tela_Inicial.png)"
    tela.insertAdjacentHTML('beforeend','<button id="bt_start"></button>')
    tela.insertAdjacentHTML('beforeend','<button id="exit"></button>')
    let bt_start =  document.querySelector('#bt_start')
    let bt_exit = document.getElementById('exit')
    
    
    
    bt_exit.addEventListener('click',()=>{window.close()})
    bt_start.addEventListener('click',()=>{
        document.querySelectorAll('button').forEach(bt=>bt.remove())
        tela.style.backgroundImage="url(telas/gameplaybackgroundsketch.png)"
        Game_Start()
    })
    tela.insertAdjacentHTML('beforeend','<div id="Playintro">Clique em qualquer lugar para continuar</div>')
    document.getElementById('Playintro').style.backgroundImage= 'Baiacu/Inchando/Baiacu_inchando.png'
    document.querySelector('#Playintro').addEventListener('click',()=>{
        document.querySelector('audio').play()
        document.querySelector('#Playintro').remove()
    })
    Update()
}


function Update(){
    switch(etapa){
        case "menu":
            break;
        case "game":
            Game()
            break;
        case "game over":
            Game_Over()
            break;
        case "win":
            Win()
            break;
    }
    requestAnimationFrame(Update);
}



document.addEventListener('DOMContentLoaded',Start)