import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { database } from '../Firebase/firebase'
import { AuthUserContext } from '../../navigation/AuthUserProvider'
import AppButton from '../AppButton'
import Colors from '../../utils/colors'

export default function DrawComponent({
  game,
  strokeColor,
  setShowColorPicker,
  showColorPicker,
}) {
  const { user } = useContext(AuthUserContext)
  const ref = useRef()
  const basePath = `/games/${game.uid}/draw`
  const [pathId, setPathId] = useState(Date.now())
  const [canvasLayout, setCanvasLayout] = useState()
  const [strokeWidth, setStrokeWidth] = useState(3)
  const isAuthGame = user.uid === game.createdBy

  const addPath = (path) => {
    const keys = Object.keys(path.val())
    const { settings, createdBy } = path.val()[keys[0]]

    ref.current.addPath({
      drawer: createdBy,
      size: {
        width: settings.layout.width,
        height: settings.layout.height,
      },
      path: {
        color: settings.strokeColor,
        width: settings.strokeWidth,
        id: parseInt(path.key),
        data: Object.keys(path.val()).reduce(
          (acc, curr) => [
            ...(acc || []),
            ...[`${path.val()[curr].x},${path.val()[curr].y}`],
          ],
          []
        ),
      },
    })
  }

  const onDraw = async (x, y) =>
    database.ref(`${basePath}/${pathId}`).push({
      x,
      y,
      createdBy: user.uid,
      settings: {
        layout: {
          ...canvasLayout,
        },
        strokeWidth,
        strokeColor,
      },
    })

  const onClear = () => {
    ref.current.clear()
    database.ref(basePath).remove()
    database.ref(`/games/${game.uid}/clear`).push({
      clearedAt: new Date().toISOString(),
    })
  }

  const onUndo = () => {
    const paths = ref.current
      .getPaths()
      .filter((path) => path.drawer === user.uid)
    const latestPath = paths[paths.length - 1]

    if (latestPath) {
      database.ref(`${basePath}/${latestPath.path.id}`).remove()
    }
  }

  useEffect(() => {
    if (canvasLayout) {
      // only push when a new path is created
      const onDrawAdded = database
        .ref(basePath)
        .on('child_added', (path) => addPath(path))

      // when path is updated, remove & re create it
      const onDrawChanged = database
        .ref(basePath)
        .on('child_changed', (path) => {
          ref.current.deletePath(parseInt(path.key))
          addPath(path)
        })

      const onDrawRemoved = database
        .ref(basePath)
        .on('child_removed', (path) =>
          ref.current.deletePath(parseInt(path.key))
        )

      const clearPath = `/games/${game.uid}/clear`
      const onDrawClear = database.ref(clearPath).on('child_added', () => {
        database.ref(clearPath).remove()
        ref.current.clear()
      })

      return () => {
        database.ref(basePath).off('child_added', onDrawAdded)
        database.ref(basePath).off('child_changed', onDrawChanged)
        database.ref(basePath).off('child_removed', onDrawRemoved)
        database.ref(clearPath).off('child_added', onDrawClear)
      }
    }
  }, [canvasLayout])

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        display: showColorPicker ? 'none' : 'flex',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          borderBottomWidth: 1,
          borderColor: Colors.primary,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            borderBottomWidth: 1,
            borderColor: Colors.primary,
          }}
        >
          <View style={{ flexDirection: 'row', width: '100%' }}>
            {isAuthGame ? (
              <>
                <AppButton
                  title="Clear"
                  style={{ width: 100, marginRight: 10, marginLeft: 10 }}
                  onPress={onClear}
                />
                <AppButton
                  title="Undo"
                  onPress={onUndo}
                  style={{ width: 100, marginRight: 10 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setStrokeWidth(strokeWidth + 3)
                    if (strokeWidth > 50) {
                      setStrokeWidth(3)
                    }
                  }}
                  style={{
                    marginHorizontal: 2.5,
                    marginVertical: 8,
                    width: 55,
                    height: 55,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.primary,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: strokeColor,
                      marginHorizontal: 2.5,
                      width: Math.sqrt(strokeWidth / 3) * 10,
                      height: Math.sqrt(strokeWidth / 3) * 10,
                      borderRadius: (Math.sqrt(strokeWidth / 3) * 10) / 2,
                    }}
                  />
                </TouchableOpacity>
                <AppButton
                  onPress={() => setShowColorPicker(true)}
                  style={{
                    width: 50,
                    marginRight: 10,
                    position: 'absolute',
                    right: 10,
                    bottom: 0,
                    top: 0,
                    backgroundColor: strokeColor,
                  }}
                />
              </>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  width: '100%',
                  marginTop: 20,
                  marginBottom: 17,
                }}
              >
                {game.name}
              </Text>
            )}
          </View>
        </View>
        <View
          onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
          style={{ flex: 1, flexDirection: 'row' }}
        >
          <SketchCanvas
            touchEnabled={isAuthGame}
            ref={ref}
            style={{ flex: 1 }}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            onStrokeStart={onDraw}
            onStrokeEnd={({ path }) => {
              ref.current.deletePath(path.id)
              setPathId(Date.now())
            }}
            onStrokeChanged={onDraw}
          />
        </View>
      </View>
    </View>
  )
}
