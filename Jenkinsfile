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
            when {
                anyOf {
                    changeRequest() 
                    branch 'main'
                }
            }
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            when {
                anyOf {
                    changeRequest() 
                    branch 'main'
                }
            }
            steps {
                sh """
                    echo "$DOCKER_LOGIN_PSW" | docker login -u "$DOCKER_LOGIN_USR" --password-stdin
                """
            }
        }

        stage('Build Images') {
            when {
                anyOf {
                    changeRequest() 
                    branch 'main'
                }
            }
            steps {
                sh "BUILD_NUMBER=${env.BUILD_NUMBER} docker compose build"
            }
        }

        stage('Push Images') {
            when {
                anyOf {
                    changeRequest() 
                    branch 'main'
                }
            }
            steps {
                sh "BUILD_NUMBER=${env.BUILD_NUMBER} docker compose push"
            }
        }
        stage('Inline Secret into Deployment') {
            when {
                anyOf {
                    changeRequest() 
                    branch 'main'
                }
            }
            steps {
                withCredentials([file(credentialsId: 'k8s-secret-file', variable: 'SECRET_FILE')]) {
                    sh """
                        echo 'Appending secret to deployment.yaml'

                        echo "\\n---" >> k8s/deployment.yaml

                        cat "$SECRET_FILE" >> k8s/deployment.yaml
                    """
                }
            }
        }
        stage('Render Deployment') {
            when {
                anyOf {
                    changeRequest()
                    branch 'main'
                }
            }
            steps {
                sh """
                    sed -i "s#${IMAGE_NAME}:.*#${IMAGE_NAME}:${BUILD_NUMBER}#g" k8s/deployment.yaml
                """
            }
        }

        stage('Deploy to GKE') {
            when {
                branch 'main'
            }
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



