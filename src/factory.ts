import {
	Entity,
	engine,
	Transform,
	MeshRenderer,
	MeshCollider,
	PointerEvents,
	PointerEventType,
	InputAction,
	Material,
	AudioSource
} from '@dcl/sdk/ecs'
import { Cube, Spinner, Tile, TileColor } from './components'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { getRandomHexColor } from './utils'
import * as utils from '@dcl-sdk/utils'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityIDs } from './modules/factory'



export let MY_COLOR: TileColor = Math.floor(Math.random() * 4 + 1)


export function createTile(x: number, y: number, z: number, id: number) {
	const entity = engine.addEntity()

	// Used to track the colors
	Tile.create(entity, { color: TileColor.NONE })

	Transform.create(entity, { position: { x, y, z }, rotation: Quaternion.fromEulerDegrees(90, 0, 0), scale: Vector3.create(2.5, 2.5, 2.5) })

	// set how the cube looks and collides
	MeshRenderer.setPlane(entity)

	Material.setPbrMaterial(entity, { albedoColor: Color4.White() })

	AudioSource.create(entity, { playing: false, volume: 0.3, loop: false, audioClipUrl: 'assets/sounds/coinPickup.mp3' })

	syncEntity(entity, [Material.componentId, AudioSource.componentId], id)

	return entity

}


export function createColorSelector(x: number, y: number, z: number, color: TileColor, id: SyncEntityIDs) {
	const entity = engine.addEntity()


	Transform.create(entity, { position: { x, y, z }, rotation: Quaternion.fromEulerDegrees(90, 0, 0), scale: Vector3.create(3, 3, 3) })

	// set how the cube looks and collides
	MeshRenderer.setPlane(entity)

	AudioSource.create(entity, { playing: false, volume: 0.5, loop: false, audioClipUrl: 'assets/sounds/coinPickup.mp3' })


	switch (color) {
		case TileColor.BLUE:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Blue() })
			break;
		case TileColor.GREEN:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Green() })
			break;
		case TileColor.RED:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Red() })
			break;
		case TileColor.YELLOW:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Yellow() })
			break;
	}

	utils.triggers.addTrigger(entity, 1, 1, [{ type: 'box' }], (entity) => {
		MY_COLOR = color
		//console.log("CHANGED COLOR TO ", color)
		activateSelector(entity, color)

	}, (entity) => {

		deactivateSelector(entity, color)
	}
	)


	syncEntity(entity, [Material.componentId, AudioSource.componentId], id)

	return entity

}


export function activateSelector(entity: Entity, color: TileColor) {

	switch (color) {
		case TileColor.BLUE:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Blue(), emissiveColor: Color4.Blue(), emissiveIntensity: 1 })
			break;
		case TileColor.GREEN:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Green(), emissiveColor: Color4.Green(), emissiveIntensity: 1 })
			break;
		case TileColor.RED:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Red(), emissiveColor: Color4.Red(), emissiveIntensity: 1 })
			break;
		case TileColor.YELLOW:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Yellow(), emissiveColor: Color4.Yellow(), emissiveIntensity: 1 })
			break;
	}
}

export function deactivateSelector(entity: Entity, color: TileColor) {

	switch (color) {
		case TileColor.BLUE:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Blue() })
			break;
		case TileColor.GREEN:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Green() })
			break;
		case TileColor.RED:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Red() })
			break;
		case TileColor.YELLOW:
			Material.setPbrMaterial(entity, { albedoColor: Color4.Yellow() })
			break;
	}
}