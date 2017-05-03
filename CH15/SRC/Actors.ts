
import {Vector} from '../../Objects/Objects'
import {Level} from './Level';
import {IKeysPressed, gameConfig} from './Game'

let cfg = gameConfig;

export type IActor = { 
	pos: Vector, 
	size: Vector, 
	speed?: Vector, 
	type: string, 
	act?: Function }

export class Player implements IActor {
	public pos: Vector;
	public size: Vector;
	public speed: Vector;
	public type: string;

	constructor(pos: Vector) {
		this.pos = pos.plus(new Vector(0, -0.5));
		this.size = new Vector(0.8, 1.5),
		this.type = "player",
		this.speed = new Vector(0, 0)
	}

	moveX(step: number, level: Level, keys: IKeysPressed) {
		this.speed.x = 0;
		if (keys["left"]) this.speed.x -= cfg.playerXSpeed;
		if (keys["right"]) this.speed.x += cfg.playerXSpeed;

		var motion = new Vector(this.speed.x * step, 0);
		var newPos = this.pos.plus(motion);
		var obstacle = level.obstacleAt(newPos, this.size);
		if (obstacle)
			level.playerTouched(obstacle);
		else
			this.pos = newPos;
	};

	moveY(step: number, level: Level, keys:IKeysPressed) {
		this.speed.y += step * cfg.gravity;
		var motion = new Vector(0, this.speed.y * step);
		var newPos = this.pos.plus(motion);
		var obstacle = level.obstacleAt(newPos, this.size);
		if (obstacle) {
			level.playerTouched(obstacle);
			if (keys["up"] && this.speed.y > 0)
				this.speed.y = -cfg.jumpSpeed;
			else
				this.speed.y = 0;
		} else {
			this.pos = newPos;
		}
	};

	act(step: number, level: Level, keys:IKeysPressed) {
		this.moveX(step, level, keys);
		this.moveY(step, level, keys);

		var otherActor = level.actorAt(this);
		if (otherActor)
			level.playerTouched(otherActor.type, otherActor);
	
		// Losing animation
		if (level.status == "lost") {
			this.pos.y += step;
			this.size.y -= step;
		}
	};
}

export class Lava implements IActor {

	public pos: Vector;
	public size: Vector;
	public speed: Vector;
	public type: string;
	public repeatPos: Vector;

	constructor(pos: Vector, ch: string) {
		var s: Vector;
		if (ch == "=") {
			s = new Vector(2, 0);
		} else if (ch == "|") {
			s = new Vector(0, 2);
		} else if (ch == "v") {
			s = new Vector(0, 3);
			this.repeatPos = pos;
		}

		this.pos = pos;
		this.size = new Vector(1, 1);
		this.type = "lava";
		this.speed = s;
	}

	act(step: number, level: Level) {
		var newPos = this.pos.plus(this.speed.times(step));
		if (!level.obstacleAt(newPos, this.size))
			this.pos = newPos;
		else if (this.repeatPos)
			this.pos = this.repeatPos;
		else
			this.speed = this.speed.times(-1);
	};
}

export class Coin implements IActor {

	public pos: Vector;
	public size: Vector;
	public speed: Vector;
	public type: string;
	public basePos: Vector;
	public wobble: number;

	constructor(pos: Vector) {
		this.pos = pos,
		this.size = new Vector(0.6, 0.6)
		this.type = "coin";
		this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
		this.wobble = Math.random() * Math.PI * 2;
	}
	
	act(step: number) {
	  this.wobble += step * cfg.wobbleSpeed;
	  var wobblePos = Math.sin(this.wobble) * cfg.wobbleDist;
	  this.pos = this.basePos.plus(new Vector(0, wobblePos));
	};
}
