let Player_anim = {
    idle:[
        'player/idle/playeridle2.png',
        'player/idle/playeridle3.png',
        'player/idle/playeridle1.png'
    ],
    shoot:[
        'player/attack/playerattack1.png',
        'player/attack/playerattack2.png',
        'player/attack/playerattack3.png',
        'player/attack/playerattack3.png'
    ],
    dash:[
        'player/dash/playerdash1.png',
        'player/dash/playerdash2.png',
        'player/dash/playerdash3.png',
        'player/dash/playerdash3.png',
        'player/dash/playerdash3.png'
    ],
    hit:[
        'player/idle/playeridle1.png',
        'player/blank.png'
    ]
}

let peixe_anim = {
    green:[{img:'inimigos/peixe_normal_green.png'}],
    pink:[{img:'inimigos/peixe_normal_pink.png'}]
}

let Boss_anim = {
    idle:[
        {img:'Baiacu/Inchando/Baiacu_inchando.png'},
        {x:0,y:0,w:256,h:256},
        {x:-256,y:0,w:256,h:256},
        {x:-512,y:0,w:256,h:256},
        {x:-512,y:0,w:256,h:256},
        {x:-512,y:0,w:256,h:256},
        {x:-512,y:0,w:256,h:256},
        {x:-256,y:0,w:256,h:256},
        {x:0,y:0,w:256,h:256}
    ],
    inflate:[
        {img:'Baiacu/Inchando/Baiacu_inchando.png'}
    ],
    prp_spin:[
        {img:'Baiacu/prepare_spin/Baiacu_prepare_spin.png'},
    ],
    spin:[
        {img:'Baiacu/Spin/Baiacu_spin.png'}
    ],
    deflate:[
        {img:'Baiacu/Inchando/Baiacu_inchando.png'}
    ],
    max_inflate:[
        {img:'Baiacu/Inchando/Baiacu_inchando.png'}
    ],
    toxic_gas:[
        {img:'Baiacu/veneno/Baiacu_veneno.png'}
    ],
    toxic_gas_2:[
        {img:'Baiacu/veneno/Baiacu_veneno.png'}
    ]
}

let gas = [
    'Baiacu/projetilveneno/projetilveneno1.png',
    'Baiacu/projetilveneno/projetilveneno2.png',
    'Baiacu/projetilveneno/projetilveneno3.png',
]

let heart = [
    'hud/c1.png',
    'hud/c2.png',
    'hud/c3.png',
    'hud/c4.png'
]



for(let i=0;i<6;i++){Boss_anim.inflate.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=0;i<6;i++){Boss_anim.prp_spin.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=0;i<4;i++){Boss_anim.spin.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=5;i>-1;i--){Boss_anim.deflate.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=0;i<6;i++){Boss_anim.max_inflate.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=0;i<6;i++){Boss_anim.max_inflate.push({x:-5*256,y:0,w:256,h:256})}
for(let i=5;i>-1;i--){Boss_anim.max_inflate.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=0;i<4;i++){Boss_anim.toxic_gas.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=4;i<7;i++){Boss_anim.toxic_gas_2.push({x:-1*i*256,y:0,w:256,h:256})}
for(let i=0;i<8;i++){peixe_anim.green.push({x:i*-1*64,y:0,w:64,h:64})}
for(let i=0;i<8;i++){peixe_anim.pink.push({x:i*-1*64,y:0,w:64,h:64})}