// We define the empty imports so the auto-complete feature works as expected.
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Material, MeshRenderer, PointerEventType, PointerEvents, Transform, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

import { colorTiles, resetAllTiles } from './systems'
import { setupUi } from './ui'
import { createColorSelector, createTile } from './factory'
import { TileColor } from './components'
import { syncEntity } from '@dcl/sdk/network'
import * as utils from '@dcl-sdk/utils'
import { SyncEntityIDs, createBeerGlass, createTap } from './modules/factory'
import { BeerType } from './definitions'
import { pickingGlassSystem } from './modules/beerGlass'
import { tapPumpSystem } from './modules/tap'

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
	let id = 300

	// draw tiles
	for (let x = 22; x < 73; x += 2.6) {
		for (let y = 2; y < 54; y += 2.6) {
			createTile(x, 0, y, id)
			id++
		}
	}

	// color pickers
	const red = createColorSelector(4, 0, 60, TileColor.RED, SyncEntityIDs.REDTILE)

	const blue = createColorSelector(8, 0, 60, TileColor.BLUE, SyncEntityIDs.BLUETILE)

	const green = createColorSelector(12, 0, 60, TileColor.GREEN, SyncEntityIDs.GREENTILE)

	const yellow = createColorSelector(16, 0, 60, TileColor.YELLOW, SyncEntityIDs.YELLOWTILE)


	engine.addSystem(colorTiles)


	const floor = engine.addEntity()
	Transform.create(floor, { position: { x: 40, y: -0.01, z: 40 }, scale: { x: 80, y: 80, z: 80 }, rotation: Quaternion.fromEulerDegrees(90, 0, 0) })
	MeshRenderer.setPlane(floor)
	Material.setPbrMaterial(floor, { albedoColor: Color4.fromHexString("#92b096") })

	utils.addTestCube({ position: Vector3.create(40, 1, 60) }, (cube) => {
		resetAllTiles()
	}, "RESET ALL TILES", Color4.Red())

	// draw UI. Here is the logic to spawn cubes.
	//setupUi()

	// Create tables
	const tables = engine.addEntity()
	Transform.create(tables, {
		position: Vector3.create(0, 0, 0)
	})
	GltfContainer.create(tables, { src: 'models/tables.glb' })
	PointerEvents.create(tables, {
		pointerEvents: [
			{
				eventType: PointerEventType.PET_DOWN,
				eventInfo: {
					showFeedback: false
				}
			}
		]
	})

	// Create floor
	const beerFloor = engine.addEntity()
	Transform.create(beerFloor, {
		position: Vector3.create(0, 0, 0)
	})
	GltfContainer.create(beerFloor, {
		src: 'models/baseDarkWithCollider.glb'
	})
	PointerEvents.create(beerFloor, {
		pointerEvents: [
			{
				eventType: PointerEventType.PET_DOWN,
				eventInfo: {
					showFeedback: false
				}
			}
		]
	})
	syncEntity(beerFloor, [], SyncEntityIDs.TABLES)

	// Create dispenser
	const dispenserEntity = engine.addEntity()
	GltfContainer.create(dispenserEntity, {
		src: 'models/beerDispenser.glb'
	})
	Transform.create(dispenserEntity, {
		position: Vector3.create(8, 1.25, 7.5)
	})

	// Create taps
	createTap(BeerType.RED, dispenserEntity, SyncEntityIDs.RED)
	createTap(BeerType.GREEN, dispenserEntity, SyncEntityIDs.GREEN)
	createTap(BeerType.YELLOW, dispenserEntity, SyncEntityIDs.YELLOW)

	// Beer glasses
	const beerGlassModel = 'models/beerGlass.glb'
	createBeerGlass(beerGlassModel, Vector3.create(8.3, 1.25, 8), SyncEntityIDs.GLASS1)
	createBeerGlass(beerGlassModel, Vector3.create(7.8, 1.25, 8.3), SyncEntityIDs.GLASS2)
	createBeerGlass(beerGlassModel, Vector3.create(1.86, 0.8, 13.4), SyncEntityIDs.GLASS3)
	createBeerGlass(beerGlassModel, Vector3.create(2.3, 0.8, 14), SyncEntityIDs.GLASS4)
	createBeerGlass(beerGlassModel, Vector3.create(13.7, 0.8, 13.8), SyncEntityIDs.GLASS5)
	createBeerGlass(beerGlassModel, Vector3.create(13.9, 0.8, 14.3), SyncEntityIDs.GLASS6)
	createBeerGlass(beerGlassModel, Vector3.create(14.5, 0.8, 2.5), SyncEntityIDs.GLASS7)
	createBeerGlass(beerGlassModel, Vector3.create(13.7, 0.8, 1.9), SyncEntityIDs.GLASS8)
	createBeerGlass(beerGlassModel, Vector3.create(2.4, 0.8, 1.5), SyncEntityIDs.GLASS9)

	engine.addSystem(pickingGlassSystem)
	engine.addSystem(tapPumpSystem)

}
