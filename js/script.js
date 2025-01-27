let tela;
let etapa = "menu"
let DJ

let teste

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
let score = 1
let HP = 5
let player_hitbox;
let hearts



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
            case 40: dow = true
                break;
            case 83: dow = true
                break;
            case 38: cim = true
                break;
            case 87: cim = true
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
            case 38: cim = false
                break;
            case 87: cim = false
                break;
            case 32:
                break;
            case 16: dash = false
                break;
        }
    },
    movendo:()=>{
        player_hitbox.style.left = player.offsetLeft+15+"px"
        player_hitbox.style.top = player.offsetTop+10+"px"
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
            player_timer++
            if(player_timer>=30){
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
        if(velocidadeX==1&&velocidadeY==1){
            player.timer_slow++
            if(player.timer_slow>=40){
                velocidadeX=3
                velocidadeY=3
            }
        }

        if(!shoot_ready){
            player.timer_recoil++
            if(player.timer_recoil>=20){
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
        if(bullet.timer>20){
            bullet.zigzag*=-1
            bullet.timer=0
        }
        Mover(bullet,{x:bullet.zigzag,y:-5})
        if(Colisao_Quadrada(bullet,Boss.hitbox)){
            bullet.remove()
            Boss.HP--
        }
        if(bullet.offsetTop<(bullet.offsetHeight*-1)){bullet.remove()}
    })
}

function SpawnBoss(){
    tela.insertAdjacentHTML('beforeend','<div id="Boss"></div>')
    tela.insertAdjacentHTML('beforeend','<div id="boss_col"></div>')
    Boss = document.getElementById('Boss')
    Boss.hitbox = document.getElementById('boss_col')
    Boss.style.left = Math.round(tela.offsetWidth/2-Boss.offsetWidth/2)+"px"
    Boss.style.top = "-180px"
    Boss.acao = "aparecer"
    Boss.timer_2 = 0
    Boss.spikes = 50
    Boss.acoes_secundarias = 0
    Boss.lado_da_tela=0
    Boss.animacao_atual = Boss_anim.idle
    Boss.frame_size = {w:1536,h:256}
    Boss.body_range = 50
    Boss.acoes_principais = ['Shooting','Emboscar','Bixo Piruleta','Oh u GAAIZ','Oh u GAAIZ']
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
    Boss.HP = 30
    console.log(Boss.animacao_atual)
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
            if(Boss.timer_2 >= 100){
                Boss.timer_2 =0
                Boss.acoes_secundarias =0
                Boss.acao = Boss.acoes_principais[Math.round(Math.random()*4)]
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
                            console.log(Boss.animacao_atual)
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
                            Boss.spikes = 50
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
                        if(Boss.movimento.x==0){Boss.movimento.x=(Math.round(Math.random()*7)+3)}
                        if(Boss.movimento.y==0){Boss.movimento.y=(Math.round(Math.random()*4)+4)
                        }
                        
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

            if(Colisao_Circular(player_hitbox,spike,16)){
                HP-=1
                spike.remove()
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
    if(Colisao_Circular(player,Boss.hitbox,Boss.body_range)){
        if(!player.knocked){
            player.knocked=true
            HP--
        }
    }
    if(Boss.HP<=0){
        let Tudo = document.querySelectorAll('#Game>*')
        Tudo.forEach(x=>x.remove())
        tela.insertAdjacentHTML('beforeend','<div id="win"></div>')
        etapa="win"
        DJ.pause()
    }
    Animar(Boss,Boss.Fps,Boss.animacao_atual,Boss.frame_size)
}


/**
 * Função pra começar o game
 */
function Game_Start(){
    tela.insertAdjacentHTML('beforeend','<div id="Player"></div>')
    player = document.getElementById('Player')
    tela.insertAdjacentHTML('beforeend','<div id="Player_hitbox"></div>')
    player_hitbox = document.getElementById('Player_hitbox')
    player.timer_slow=0
    player.knocked = false
    player.time_knock =0
    HP = 5
    score=1
    bossfight=false
    player.timer_recoil = 0
    teste = document.getElementById
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
    Controles.movendo()
    Controles.clamp()
    Controles.animacao()
    if(HP<=0){
        let Tudo = document.querySelectorAll('#Game>*')
        Tudo.forEach(x=>x.remove())
        etapa="game over"
        tela.insertAdjacentHTML('beforeend','<button>Voltar</button>')
        tela.insertAdjacentHTML('beforeend','<div id="gameover"></div>')
        document.querySelector('button').addEventListener('click',()=>{
            document.querySelector('button').remove()
            etapa="menu"
            tela.style.backgroundImage = 'url(telas/gameplaybackgroundsketch.png)'
            tela.insertAdjacentHTML('beforeend','<button>Começar</button>')
            document.querySelector('button').addEventListener('click',()=>{
                document.querySelector('button').remove()
                Game_Start()
            })

        })
        DJ.pause()
        
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


    if(bossfight){
        Boss_Battle()
    }else{
        if(score >= 1){
            SpawnBoss()
            bossfight =true
        }
    }



    
}

function Start(){
    tela = document.getElementById('Game')
    tela.style.backgroundImage="url(telas/Tela_Inicial.png)"
    tela.insertAdjacentHTML('beforeend','<button id="bt_start"></button>')
    tela.insertAdjacentHTML('beforeend','<button id="exit"></button>')
    let bt_start =  document.querySelector('#bt_start')
    let bt_exit = document.getElementById('exit')

    DJ = document.getElementById('Music')
    
    
    bt_exit.addEventListener('click',()=>{window.close()})
    bt_start.addEventListener('click',()=>{
        document.querySelectorAll('button').forEach(bt=>bt.remove())
        tela.style.backgroundImage="url(telas/gameplaybackgroundsketch.png)"
        DJ.currentTime = 0
        DJ.play()
        Game_Start()
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
            break;
        case "win":
            break;
    }
    requestAnimationFrame(Update);
}



document.addEventListener('DOMContentLoaded',Start)