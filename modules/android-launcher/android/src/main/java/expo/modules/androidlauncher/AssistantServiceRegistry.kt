package expo.modules.androidlauncher

interface AssistantServiceActions {
  fun goBack(): Boolean
  fun openRecents(): Boolean
}

object AssistantServiceRegistry {
  var current: AssistantServiceActions? = null
}