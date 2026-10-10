pipeline {
  agent any
  environment { NODE_ENV = 'test' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install') { steps { sh 'npm ci || npm install' } }
    stage('Test') { steps { sh 'npm test' } }
    stage('Build image') { steps { sh 'docker build -t candidate-api:${BUILD_NUMBER} .' } }
  }
  post { always { echo 'Pipeline finished. Configure registry credentials and deployment stages for your environment.' } }
}
