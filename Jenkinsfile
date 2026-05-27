pipeline {
    agent any

    environment {
        DOCKER_LOGIN = credentials('dockerhub-learning')
        CREDENTIALS_ID = '850d941b-7a1b-479d-8e1d-6b0d40b89d68'
        PROJECT_ID = 'sonsaekim-ai'
        CLUSTER_NAME = 'k8s'
        LOCATION = 'asia-northeast3-a'
        IMAGE_NAME = 'mminnn28/sswu_sonsaekim-learning'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                sh 'echo "$DOCKER_LOGIN_PSW" | docker login -u "$DOCKER_LOGIN_USR" --password-stdin'
            }
        }

        stage('Build Images') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Push Images') {
            steps {
                sh "docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Render Deployment') {
            steps {
                sh "sed -i 's#${IMAGE_NAME}:.*#${IMAGE_NAME}:${BUILD_NUMBER}#g' k8s/deployment.yaml"
            }
        }

        stage('Deploy to GKE') {
            steps {
                step([
                    $class: 'KubernetesEngineBuilder',
                    projectId: env.PROJECT_ID,
                    clusterName: env.CLUSTER_NAME,
                    location: env.LOCATION,
                    manifestPattern: 'k8s/deployment.yaml',
                    credentialsId: env.CREDENTIALS_ID,
                    verifyDeployments: true
                ])
            }
        }
    }

    post {
        success { echo "SUCCESS" }
        failure { echo "FAILED" }
    }
}
