FROM jboss/wildfly
ADD /var/lib/jenkins/sharedspace/SHAREDWORKSPACE/JKEBuildScripts/sample.jke.build/build/jke.war /opt/jboss/wildfly/standalone/deployments/
