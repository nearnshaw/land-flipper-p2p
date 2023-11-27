// We define the empty imports so the auto-complete feature works as expected.
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Material, MeshRenderer, Transform, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

import { colorTiles, resetAllTiles } from './systems'
import { setupUi } from './ui'
import { SyncEntityIDs, createColorSelector, createTile } from './factory'
import { TileColor } from './components'
import { syncEntity } from '@dcl/sdk/network'
import * as utils from '@dcl-sdk/utils'

// You can remove this if you don't use any asset packs
initAssetPacks(engine, pointerEventsSystem, {
	Animator,
	AudioSource,
	AvatarAttach,
	Transform,
	VisibilityComponent,
	GltfContainer
})

export function main() {

	// id counter for the tiles
	let id = 100

	// draw tiles
	for (let x = 1; x < 52; x += 2.6) {
		for (let y = 1; y < 52; y += 2.6) {
			createTile(x, 0, y, id)
			id++
		}
	}

	// color pickers
	const red = createColorSelector(4, 0, 60, TileColor.RED, SyncEntityIDs.RED)

	const blue = createColorSelector(8, 0, 60, TileColor.BLUE, SyncEntityIDs.BLUE)

	const green = createColorSelector(12, 0, 60, TileColor.GREEN, SyncEntityIDs.GREEN)

	const yellow = createColorSelector(16, 0, 60, TileColor.YELLOW, SyncEntityIDs.YELLOW)


	engine.addSystem(colorTiles)


	const floor = engine.addEntity()
	Transform.create(floor, { position: { x: 32, y: -0.01, z: 32 }, scale: { x: 64, y: 64, z: 64 }, rotation: Quaternion.fromEulerDegrees(90, 0, 0) })
	MeshRenderer.setPlane(floor)
	Material.setPbrMaterial(floor, { albedoColor: Color4.fromHexString("#92b096") })

	utils.addTestCube({ position: Vector3.create(40, 1, 60) }, (cube) => {
		resetAllTiles()
	}, "RESET ALL TILES", Color4.Red())

	// draw UI. Here is the logic to spawn cubes.
	//setupUi()
}
