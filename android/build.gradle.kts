// Top-level build file: opções comuns a todos os sub-projetos/módulos.
// As dependências de plugins são declaradas no Version Catalog (gradle/libs.versions.toml).
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.google.services)     apply false
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
