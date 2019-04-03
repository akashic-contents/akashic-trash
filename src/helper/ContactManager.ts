import { Box2D, Box2DWeb } from "@akashic-extension/akashic-box2d";

export interface ContactManagerParameter {
	box2d: Box2D;
}

/**
 * 衝突情報を管理するマネージャ。
 */
export class ContactManager {
	collided: g.Trigger<[Box2DWeb.Dynamics.b2Body, Box2DWeb.Dynamics.b2Body]>;
	private box2d: Box2D;
	private triggerMap: { [id: string]: g.Trigger<void>; };

	constructor(param: ContactManagerParameter) {
		this.box2d = param.box2d;
		this.triggerMap = {};

		const contactListener = new Box2DWeb.Dynamics.b2ContactListener();
		contactListener.BeginContact = contact => {
			const idA = contact.GetFixtureA().GetBody().GetUserData();
			const idB = contact.GetFixtureB().GetBody().GetUserData();
			const id1 = `${idA}-${idB}`;
			const id2 = `${idB}-${idA}`;
			if (this.triggerMap[id1] && !this.triggerMap[id1].destroyed()) {
				this.triggerMap[id1].fire();
			} else if (this.triggerMap[id2] && !this.triggerMap[id2].destroyed()) {
				this.triggerMap[id2].fire();
			}
		};
		this.box2d.world.SetContactListener(contactListener);
	}

	createCollidedTrigger(bodyA: Box2DWeb.Dynamics.b2Body, bodyB: Box2DWeb.Dynamics.b2Body): g.Trigger<void> {
		const id = `${bodyA.GetUserData()}-${bodyB.GetUserData()}`;
		if (this.triggerMap[id]) {
			return this.triggerMap[id];
		} else {
			this.triggerMap[id] = new g.Trigger();
			return this.triggerMap[id];
		}
	}

	removeCollidedTrigger(bodyA: Box2DWeb.Dynamics.b2Body, bodyB: Box2DWeb.Dynamics.b2Body): boolean {
		const idA = bodyA.GetUserData();
		const idB = bodyB.GetUserData();
		const id1 = `${idA}-${idB}`;
		const id2 = `${idB}-${idA}`;

		if (this.triggerMap[id1]) {
			const trigger = this.triggerMap[id1];
			if (!trigger.destroyed()) {
				trigger.destroy();
			}
			delete this.triggerMap[id1];
			return true;
		} else if (this.triggerMap[id2]) {
			const trigger = this.triggerMap[id2];
			if (!trigger.destroyed()) {
				trigger.destroy();
			}
			delete this.triggerMap[id2];
			return true;
		}

		return false;
	}
}
